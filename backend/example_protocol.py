import asyncio
import logging
import math
from typing import List, Dict, Tuple
from pylabrobot.liquid_handling import LiquidHandler
from pylabrobot.liquid_handling.backends import LiquidHandlerChatterboxBackend
from pylabrobot.visualizer.visualizer import Visualizer
from pylabrobot.resources.hamilton import STARLetDeck
from pylabrobot.resources import (
    TIP_CAR_480_A00,
    PLT_CAR_L5AC_A00,
    Trough_CAR_4R200_A00,
    Cor_96_wellplate_360ul_Fb,
    HTF
)
from pylabrobot.resources.vwr import VWRReagentReservoirs25mL

CSV_FILE_PATH = '/Users/evan_kim/startup/pylabrobot/protocol-designer/backend/structured96.csv'

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# these 2 lines needed to enable sensible tip and volume tracking
from pylabrobot.resources import set_tip_tracking, set_volume_tracking
set_tip_tracking(True), set_volume_tracking(True)

lh = LiquidHandler(backend=LiquidHandlerChatterboxBackend(), deck=STARLetDeck())
async def setup_lh():
    await lh.setup()


vis = Visualizer(resource=lh, open_browser=False)
async def setup_vis():
    await vis.setup()

# Load carriers onto the deck
tip_car = TIP_CAR_480_A00(name='tip carrier')
tip_car[0] = tip_rack1 = HTF(name='tips_01', with_tips=False)
tip_car[1] = tip_rack2 = HTF(name='tips_02', with_tips=False)
tip_rack1.fill()
tip_rack2.fill()

# Setup trough carrier for compounds
trough_car = Trough_CAR_4R200_A00(name='trough carrier')
compound_troughs = {}
for i, compound in enumerate(['Compound A', 'Compound B', 'Compound C', 'Compound D']):
    trough_car[i] = compound_troughs[compound] = VWRReagentReservoirs25mL(name=f'trough_{compound}')

plt_car = PLT_CAR_L5AC_A00(name='plate carrier')
plt_car[0] = assay_plate = Cor_96_wellplate_360ul_Fb(name='assay_plate')


async def assign_resources():
    lh.deck.assign_child_resource(tip_car, rails=15)
    lh.deck.assign_child_resource(trough_car, rails=2)
    lh.deck.assign_child_resource(plt_car, rails=8)


def get_well_coordinates(index: int, num_rows: int = 8) -> Tuple[str, int]:
    """Convert linear index to well coordinates (e.g., 0 -> A1, 8 -> A2)"""
    row = index % num_rows
    col = index // num_rows + 1
    return f'{chr(65 + row)}', col

def validate_volumes(volumes: List[float], max_volume: float = 360.0) -> None:
    """Validate that volumes are within acceptable range"""
    if any(v <= 0 or v > max_volume for v in volumes):
        raise ValueError(f"Volume must be between 0 and {max_volume}μL")

def count_required_tips(data: List[Dict], compounds: List[str]) -> int:
    """Count total number of tips needed for the protocol"""
    total_operations = sum(len([row for row in data if row[compound]]) for compound in compounds)
    return total_operations

def calculate_total_volume(data: List[Dict], compound: str) -> float:
    """Calculate total volume needed for a compound including extra buffer"""
    total = sum(float(row[compound]) for row in data if row[compound])
    # Add 10% buffer volume
    return total * 1.1

async def run_protocol():
    import csv
    def read_csv(file_path):
        with open(file_path, 'r') as file:
            reader = csv.DictReader(file)
            data = [row for row in reader]
        return data

    data = read_csv(CSV_FILE_PATH)
    compounds = ['Compound A', 'Compound B', 'Compound C', 'Compound D']
    K = 8  # Number of pipette tips

    # Calculate required volumes and fill troughs
    for compound in compounds:
        total_volume = calculate_total_volume(data, compound)
        if total_volume > compound_troughs[compound].max_volume:
            raise ValueError(f"Required volume {total_volume}μL for {compound} exceeds trough capacity {compound_troughs[compound].max_volume}μL")
        logging.info(f"Filling trough for {compound} with {total_volume}μL")
        compound_troughs[compound].tracker.set_liquids([(None, total_volume)])

    # Verify we have enough tips before starting
    total_tips_needed = count_required_tips(data, compounds)
    total_tips_available = len(tip_rack1.get_all_tips()) + len(tip_rack2.get_all_tips())
    logging.info(f"Protocol requires {total_tips_needed} tips, {total_tips_available} available")
    if total_tips_needed > total_tips_available:
        raise RuntimeError(f"Not enough tips available. Need {total_tips_needed}, have {total_tips_available}")

    for compound in compounds:
        # Get all non-empty volumes for this compound
        compound_data = [(i, float(row[compound]))
                        for i, row in enumerate(data)
                        if row[compound]]

        if not compound_data:
            logging.info(f"No data found for {compound}, skipping")
            continue

        logging.info(f"Processing {len(compound_data)} instances of {compound}")
        current_trough = compound_troughs[compound]

        # Process in groups of K (8 channels)
        for batch_start in range(0, len(compound_data), K):
            batch = compound_data[batch_start:batch_start + K]
            batch_indices = [b[0] for b in batch]
            batch_volumes = [b[1] for b in batch]

            try:
                # Validate volumes before proceeding
                validate_volumes(batch_volumes)

                # Calculate well positions
                # TODO: We need to make sure that new tips are being picked up (might need to turn cross-contamination tracking on)
                # just using first column for now to get it working
                tip_positions = [f'{chr(65 + i)}1' for i in range(len(batch))]
                dest_wells = [f'{get_well_coordinates(idx)[0]}{get_well_coordinates(idx)[1]}'
                            for idx in batch_indices]

                logging.info(f"Batch operation:")
                logging.info(f"  Tips: {tip_positions}")
                logging.info(f"  Source: {current_trough.name}")
                logging.info(f"  Destination wells: {dest_wells}")
                logging.info(f"  Volumes: {batch_volumes}")

                # Execute liquid handling steps
                await lh.pick_up_tips(tip_rack1[tip_positions])

                # Verify trough has enough volume
                total_batch_volume = sum(batch_volumes)
                if current_trough.tracker.get_used_volume() < total_batch_volume:
                    raise ValueError(f"Insufficient volume in trough {current_trough.name}")

                print(f"{compound} trough before aspiration: {current_trough.tracker.get_used_volume()}")

                # Use single channel for trough, AUTOMATICALLY SUBTRACTS TROUGH VOLUME
                await lh.aspirate([current_trough] * len(batch), vols=batch_volumes)

                print(f"{compound} trough after aspiration: {current_trough.tracker.get_used_volume()}")

                # Verify destination wells have enough capacity
                for well, vol in zip(dest_wells, batch_volumes):
                    available = assay_plate.get_item(well).tracker.get_free_volume()
                    if available < vol:
                        raise ValueError(f"Insufficient capacity in destination well {well}")

                await lh.dispense(assay_plate[dest_wells], vols=batch_volumes)
                await lh.drop_tips(tip_rack1[tip_positions])

                # Update trough volume
                # current_trough.tracker.set_liquids(
                #     [(None, current_trough.tracker.get_used_volume() - total_batch_volume)]
                # )

            except Exception as e:
                logging.error(f"Error during liquid handling: {str(e)}")
                # Attempt to safely discard tips if they were picked up
                try:
                    if lh.has_tips():
                        await lh.drop_tips(tip_rack1[tip_positions])
                except:
                    logging.error("Failed to safely discard tips after error")
                raise

async def main():
    await setup_lh()
    await setup_vis()
    await assign_resources()
    await run_protocol()

if __name__ == "__main__":
    asyncio.run(main())