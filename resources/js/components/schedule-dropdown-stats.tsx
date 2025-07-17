import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ScheduleDropdownStats({
    total = 0,
    breakdown = {
        active: 0,
        in_progress: 0,
        cancelled: 0,
        completed: 0,
    },
}: {
    total: number;
    breakdown: {
        active: number;
        in_progress: number;
        cancelled: number;
        completed: number;
    };
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Maintenance</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            Detail
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="space-y-1 p-2">
                        <div className="text-sm">Aktif: {breakdown.active}</div>
                        <div className="text-sm">In Progress: {breakdown.in_progress}</div>
                        <div className="text-sm">Selesai: {breakdown.completed}</div>
                        <div className="text-sm">Dibatalkan: {breakdown.cancelled}</div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{total}</div>
                <p className="text-muted-foreground mt-1 text-xs">Jumlah seluruh jadwal</p>
            </CardContent>
        </Card>
    );
}
