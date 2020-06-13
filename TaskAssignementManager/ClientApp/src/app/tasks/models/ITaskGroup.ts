import { IUserTask } from "./IUserTask";

export interface ITaskGroup {
    id: string,
    name: string,
    userTasks: IUserTask[]
}
