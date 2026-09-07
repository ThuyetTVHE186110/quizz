export type ActivityMetadata = Record<string, unknown>;

export interface ActivityRecordInput {
  actor?: string;
  action?: string;
  metadata?: ActivityMetadata;
}

export interface ActivityEntry {
  actor: string;
  action: string;
  timestamp: Date;
  metadata?: ActivityMetadata;
}

export class ActivityLog {
  record(_entry: ActivityRecordInput, _opts: { now: Date }): void {
    throw new Error('not implemented');
  }

  queryByActor(_actor: string): ActivityEntry[] {
    throw new Error('not implemented');
  }

  queryByTimeRange(_start: Date, _end: Date): ActivityEntry[] {
    throw new Error('not implemented');
  }
}
