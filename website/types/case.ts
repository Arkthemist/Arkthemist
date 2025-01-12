export interface Case {
  id: string
  title: string
  status: 'active' | 'resolved'
  dateCreated: string
  priority: 'high' | 'medium' | 'low'
  roomId?: string
}
