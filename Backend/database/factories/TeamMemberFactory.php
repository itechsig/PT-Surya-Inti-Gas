<?php

namespace Database\Factories;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeamMember>
 */
class TeamMemberFactory extends Factory
{
    protected $model = TeamMember::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'role' => fake()->jobTitle(),
            'experience' => fake()->numberBetween(1, 20) . ' tahun',
            'expertise' => fake()->word(),
            'image' => 'team/' . fake()->uuid() . '.jpg',
            'bio' => fake()->paragraph(),
            'icon' => 'user',
            'stats' => [
                'projects' => fake()->numberBetween(1, 50),
            ],
            'order' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
