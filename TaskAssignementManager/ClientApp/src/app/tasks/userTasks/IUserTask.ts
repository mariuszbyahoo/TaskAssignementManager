export interface IUserTask{
    id: string,
    name: string,
    deadline: Date,
    status: number,
    inMemoryStatus: string,
    usersId: string,
    groupId: string
}