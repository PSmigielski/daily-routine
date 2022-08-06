interface ITask {
    name: string;
    description: string | undefined;
    repeatEvery: number | undefined;
}

export default ITask;