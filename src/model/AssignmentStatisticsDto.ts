export interface AssignmentStatisticsDto {
    totalAssignments: number;
    assignmentsByStatus: StatusCountDto[];
    lateSubmissions: number;
  }
  
  export interface StatusCountDto {
    statusName: string;
    count: number;
  }