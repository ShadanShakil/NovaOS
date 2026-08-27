import { describe, it, expect } from 'vitest';
import { allocateMemory, freeMemoryBlock } from './memory';

describe('Memory Partitioning & Coalescing', () => {
  const initialBlocks = [
    { id: 1, size: 100, allocated: false, process: null },
    { id: 2, size: 300, allocated: false, process: null },
    { id: 3, size: 200, allocated: false, process: null },
  ];

  it('allocates using First Fit and splits the block', () => {
    // Request 150MB block using firstFit.
    // Block #1 (100MB) is too small.
    // Block #2 (300MB) is the first block that fits.
    // It should allocate 150MB to block #2 and create a new free block of 150MB.
    const result = allocateMemory(initialBlocks, 150, 'firstFit');
    
    expect(result.success).toBe(true);
    expect(result.blocks.length).toBe(4);
    
    // First block remains untouched
    expect(result.blocks[0].size).toBe(100);
    expect(result.blocks[0].allocated).toBe(false);

    // Allocated block
    expect(result.blocks[1].id).toBe(2);
    expect(result.blocks[1].size).toBe(150);
    expect(result.blocks[1].allocated).toBe(true);
    expect(result.blocks[1].process).toBe('App-150MB');

    // Splitted remaining free block (should get a new id)
    expect(result.blocks[2].size).toBe(150);
    expect(result.blocks[2].allocated).toBe(false);
    expect(result.blocks[2].process).toBeNull();
  });

  it('allocates using Best Fit', () => {
    // Request 150MB using bestFit.
    // Blocks available: 100MB, 300MB, 200MB.
    // Best fit is 200MB because it is the smallest block that fits 150MB.
    const result = allocateMemory(initialBlocks, 150, 'bestFit');
    
    expect(result.success).toBe(true);
    // It splits block #3 (200MB) into 150MB allocated and 50MB free
    expect(result.blocks[2].id).toBe(3);
    expect(result.blocks[2].size).toBe(150);
    expect(result.blocks[2].allocated).toBe(true);
    expect(result.blocks[3].size).toBe(50);
    expect(result.blocks[3].allocated).toBe(false);
  });

  it('coalesces adjacent free blocks during deallocation', () => {
    // Set up blocks: [Allocated 100MB, Allocated 150MB, Free 150MB, Free 200MB]
    const blocks = [
      { id: 1, size: 100, allocated: true, process: 'App-100MB' },
      { id: 2, size: 150, allocated: true, process: 'App-150MB' },
      { id: 3, size: 150, allocated: false, process: null },
      { id: 4, size: 200, allocated: false, process: null },
    ];

    // Free block #2 (150MB).
    // After freeing, block #2, #3, and #4 are all free and adjacent.
    // They should merge into a single free block of size 150 + 150 + 200 = 500MB.
    // Resulting blocks should be: [Allocated 100MB, Free 500MB]
    const result = freeMemoryBlock(blocks, 2);
    
    expect(result.length).toBe(2);
    expect(result[0].size).toBe(100);
    expect(result[0].allocated).toBe(true);

    expect(result[1].size).toBe(500);
    expect(result[1].allocated).toBe(false);
  });
});
