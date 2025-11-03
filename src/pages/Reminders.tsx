import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, CheckCircle2, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const mockTasks = [
  { id: '1', client: 'Acme Corp', dueDate: '2024-01-20', note: 'Follow up on proposal', status: 'pending' },
  { id: '2', client: 'Global Industries', dueDate: '2024-01-18', note: 'Schedule demo call', status: 'pending' },
  { id: '3', client: 'Tech Solutions', dueDate: '2024-01-22', note: 'Send contract for review', status: 'pending' },
  { id: '4', client: 'Retail Plus', dueDate: '2024-01-15', note: 'Quarterly review meeting', status: 'completed' },
];

export default function Reminders() {
  const [tasks, setTasks] = useState(mockTasks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleMarkDone = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'completed' } : task
    ));
    toast.success('Task marked as completed');
  };

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Task added successfully');
    setIsAddDialogOpen(false);
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks & Reminders</h1>
            <p className="text-muted-foreground">Stay on top of your client interactions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input id="client" placeholder="Client name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Due Date</Label>
                  <Input id="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Input id="note" placeholder="Task description" required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Task</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Pending Tasks ({pendingTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{task.client}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{task.note}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkDone(task.id)}
                      className="text-success"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Due: {task.dueDate}
                  </Badge>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No pending tasks
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Completed Tasks ({completedTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold line-through opacity-70">{task.client}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-through opacity-70">
                        {task.note}
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <Badge variant="outline" className="text-xs opacity-70">
                    Completed: {task.dueDate}
                  </Badge>
                </div>
              ))}
              {completedTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No completed tasks
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
