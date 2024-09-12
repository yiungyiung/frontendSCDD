export interface AssignmentStatisticsDto {
  totalAssignments: number;
  assignmentsByStatus: StatusCountDto[];
  lateSubmissions: number;
}

export interface StatusCountDto {
  statusID: number;
  statusName: string;
  count: number;
}
