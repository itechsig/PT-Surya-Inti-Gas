<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' Project',
            'category' => fake()->randomElement(['Industrial', 'Commercial', 'Residential']),
            'location' => fake()->city(),
            'year' => (string) fake()->year(),
            'image' => 'projects/' . fake()->uuid() . '.jpg',
            'description' => fake()->paragraph(),
            'icon' => 'factory',
            'stats' => [
                'capacity' => fake()->numberBetween(100, 1000) . ' m3',
            ],
            'order' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }
}
