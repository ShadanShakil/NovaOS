import { describe, it, expect } from 'vitest';
import { runFCFS, runSJF, runPriority, runRoundRobin } from './scheduler';

describe('CPU Scheduler Algorithms', () => {
  const mockProcesses = [
    { id: 'P1', name: 'Proc 1', burstTime: 6, arrivalTime: 0, priority: 2 },
    { id: 'P2', name: 'Proc 2', burstTime: 3, arrivalTime: 1, priority: 1 },
    { id: 'P3', name: 'Proc 3', burstTime: 8, arrivalTime: 2, priority: 3 },
  ];

  it('runFCFS schedules in arrival order', () => {
    const result = runFCFS(mockProcesses);
    
    expect(result.schedule.length).toBe(3);
    // P1 (arrives at 0, runs 6s -> ends at 6s)
    expect(result.schedule[0].id).toBe('P1');
    expect(result.schedule[0].start).toBe(0);
    expect(result.schedule[0].end).toBe(6);
    
    // P2 (arrives at 1, waits 5s -> runs 6 to 9s)
    expect(result.schedule[1].id).toBe('P2');
    expect(result.schedule[1].start).toBe(6);
    expect(result.schedule[1].end).toBe(9);

    // Verify computed metrics
    const p2Metrics = result.processes.find((p) => p.id === 'P2');
    expect(p2Metrics.waitingTime).toBe(5); // completionTime(9) - arrivalTime(1) - burstTime(3) = 5
    expect(p2Metrics.turnaroundTime).toBe(8); // completionTime(9) - arrivalTime(1) = 8
  });

  it('runSJF schedules based on Shortest Job First', () => {
    const result = runSJF(mockProcesses);
    
    // At t=0, only P1 has arrived, so it must start first.
    expect(result.schedule[0].id).toBe('P1');
    expect(result.schedule[0].end).toBe(6);
    
    // At t=6, both P2 (burst 3) and P3 (burst 8) have arrived.
    // P2 has the shorter burst time, so it runs next.
    expect(result.schedule[1].id).toBe('P2');
    expect(result.schedule[1].end).toBe(9);
    
    expect(result.schedule[2].id).toBe('P3');
    expect(result.schedule[2].end).toBe(17);
  });

  it('runPriority schedules based on Priority', () => {
    const result = runPriority(mockProcesses);
    
    // At t=0, only P1 has arrived, so it starts.
    expect(result.schedule[0].id).toBe('P1');
    expect(result.schedule[0].end).toBe(6);

    // At t=6, P2 (priority 1) and P3 (priority 3) are ready.
    // P2 is higher priority (lower number is higher priority), so it runs next.
    expect(result.schedule[1].id).toBe('P2');
    expect(result.schedule[2].id).toBe('P3');
  });

  it('runRoundRobin schedules based on Time Quantum', () => {
    const result = runRoundRobin(mockProcesses, 2);
    
    // P1 runs at t=0 for 2s (quantum) -> currentTime = 2.
    // P2 arrives at t=1, P3 arrives at t=2.
    // Queue: [P2, P3, P1]
    expect(result.schedule[0].id).toBe('P1');
    expect(result.schedule[0].start).toBe(0);
    expect(result.schedule[0].end).toBe(2);

    // Next is P2: runs for 2s -> currentTime = 4 (remaining P2 burst = 1).
    // Queue: [P3, P1, P2]
    expect(result.schedule[1].id).toBe('P2');
    expect(result.schedule[1].start).toBe(2);
    expect(result.schedule[1].end).toBe(4);

    // Next is P3: runs for 2s -> currentTime = 6 (remaining P3 burst = 6).
    // Queue: [P1, P2, P3]
    expect(result.schedule[2].id).toBe('P3');
    expect(result.schedule[2].start).toBe(4);
    expect(result.schedule[2].end).toBe(6);
  });
});
