<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    protected $model = Company::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'email' => $this->faker->unique()->companyEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'registration_number' => $this->faker->unique()->numerify('REG-####'),
            'contact_person_name' => $this->faker->name(),
            'contact_person_email' => $this->faker->email(),
            'contact_person_phone' => $this->faker->phoneNumber(),
        ];
    }
} 