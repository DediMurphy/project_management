import ComponentCard from "../../components/common/ComponentCard.jsx";
import TaskManager from "../../components/taskManager/TaskManager.jsx";

export default function TaskPage() {
    return (
        <>
            <div className="space-y-6">
                <ComponentCard title="">
                    <TaskManager />
                </ComponentCard>
            </div>
        </>
    );
}