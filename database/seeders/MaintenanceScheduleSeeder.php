<?php

namespace Database\Seeders;

use App\Models\MaintenanceSchedule;
use Illuminate\Database\Seeder;

class MaintenanceScheduleSeeder extends Seeder
{
    public function run(): void
    {
        MaintenanceSchedule::factory()->count(10)->create();
    }
} 