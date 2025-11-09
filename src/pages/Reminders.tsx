import { MainLayout } from '@/components/layout/MainLayout';
import { RemindersHeader } from '@/components/reminder/RemindersHeader';
import { PendingTasksCard } from '@/components/reminder/PendingTasksCard';
import { CompletedTasksCard } from '@/components/reminder/CompletedTasksCard';
import { useReminders } from '@/components/reminder/useReminders';

export default function Reminders() {
  const {
    clients,
    loading,
    pendingTasks,
    completedTasks,
    handleMarkDone,
    handleDeleteTask,
    handleAddTask,
  } = useReminders();

  return (
    <MainLayout>
      <div className="space-y-6">
        <RemindersHeader clients={clients} onAddTask={handleAddTask} />

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <PendingTasksCard
              tasks={pendingTasks}
              onMarkDone={handleMarkDone}
              onDelete={handleDeleteTask}
            />
            
            <CompletedTasksCard
              tasks={completedTasks}
              onDelete={handleDeleteTask}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}