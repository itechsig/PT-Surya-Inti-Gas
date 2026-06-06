<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class UnmannedAgentController extends Controller
{
    /**
     * Get unmanned agent overview statistics
     */
    public function overview(): JsonResponse
    {
        // Sample data - in production, this would come from database
        $data = [
            'total_agents' => 48,
            'active_agents' => 34,
            'active_missions' => 16,
            'alerts' => 12,
            'average_battery' => 78,
            'agent_status' => [
                'active' => 34,
                'idle' => 8,
                'on_mission' => 4,
                'maintenance' => 2,
                'offline' => 0
            ],
            'device_types' => [
                'drone' => 24,
                'robot' => 16,
                'vehicle' => 8
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Get all unmanned agents
     */
    public function index(): JsonResponse
    {
        // Sample data - in production, this would come from database
        $agents = [
            [
                'id' => 1,
                'name' => 'Drone Alpha-1',
                'type' => 'drone',
                'status' => 'active',
                'battery' => 85,
                'signal' => 95,
                'location' => ['lat' => -6.2088, 'lng' => 106.8456],
                'last_update' => now()->toDateTimeString()
            ],
            [
                'id' => 2,
                'name' => 'Robot Bravo-1',
                'type' => 'robot',
                'status' => 'active',
                'battery' => 72,
                'signal' => 88,
                'location' => ['lat' => -6.1751, 'lng' => 106.8650],
                'last_update' => now()->toDateTimeString()
            ],
            [
                'id' => 3,
                'name' => 'Drone Charlie-1',
                'type' => 'drone',
                'status' => 'warning',
                'battery' => 15,
                'signal' => 45,
                'location' => ['lat' => -6.2234, 'lng' => 106.8000],
                'last_update' => now()->toDateTimeString()
            ],
            [
                'id' => 4,
                'name' => 'Robot Delta-1',
                'type' => 'robot',
                'status' => 'in_mission',
                'battery' => 68,
                'signal' => 92,
                'location' => ['lat' => -6.1900, 'lng' => 106.8300],
                'last_update' => now()->toDateTimeString()
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'agents' => $agents,
                'total' => count($agents)
            ]
        ]);
    }

    /**
     * Get active missions
     */
    public function missions(): JsonResponse
    {
        // Sample data - in production, this would come from database
        $missions = [
            [
                'id' => 1,
                'name' => 'Survey Alpha',
                'agent' => 'Drone Alpha-1, Alpha-2',
                'type' => 'Aerial Survey',
                'location' => 'Area A - Sector 1',
                'progress' => 75,
                'status' => 'in_progress',
                'start_time' => now()->subHours(2)->toDateTimeString()
            ],
            [
                'id' => 2,
                'name' => 'Patrol Bravo',
                'agent' => 'Robot Bravo-1, Bravo-2',
                'type' => 'Ground Patrol',
                'location' => 'Area B - Sector 3',
                'progress' => 45,
                'status' => 'in_progress',
                'start_time' => now()->subHours(4)->toDateTimeString()
            ],
            [
                'id' => 3,
                'name' => 'Inspection Charlie',
                'agent' => 'Drone Charlie-1',
                'type' => 'Inspection',
                'location' => 'Area C - Sector 2',
                'progress' => 90,
                'status' => 'in_progress',
                'start_time' => now()->subHours(1)->toDateTimeString()
            ],
            [
                'id' => 4,
                'name' => 'Mapping Delta',
                'agent' => 'Robot Delta-1, Delta-2',
                'type' => 'Mapping',
                'location' => 'Area D - Sector 4',
                'progress' => 30,
                'status' => 'in_progress',
                'start_time' => now()->subHours(6)->toDateTimeString()
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'missions' => $missions,
                'total' => count($missions),
                'active_count' => count($missions)
            ]
        ]);
    }

    /**
     * Get alert notifications
     */
    public function alerts(): JsonResponse
    {
        // Sample data - in production, this would come from database
        $alerts = [
            [
                'id' => 1,
                'type' => 'critical',
                'title' => 'Baterai Rendah',
                'message' => 'Drone Alpha-3 baterai 15%',
                'time' => '2 menit lalu',
                'agent_id' => 3,
                'resolved' => false
            ],
            [
                'id' => 2,
                'type' => 'warning',
                'title' => 'Pelanggaran Geofence',
                'message' => 'Robot Charlie-2 keluar area',
                'time' => '5 menit lalu',
                'agent_id' => 4,
                'resolved' => false
            ],
            [
                'id' => 3,
                'type' => 'critical',
                'title' => 'Koneksi Terputus',
                'message' => 'Drone Bravo-1 lost signal',
                'time' => '8 menit lalu',
                'agent_id' => 2,
                'resolved' => false
            ],
            [
                'id' => 4,
                'type' => 'info',
                'title' => 'Jadwal Maintenance',
                'message' => 'Robot Delta-4 perlu servis',
                'time' => '15 menit lalu',
                'agent_id' => null,
                'resolved' => false
            ],
            [
                'id' => 5,
                'type' => 'success',
                'title' => 'Misi Selesai',
                'message' => 'Survey Alpha berhasil',
                'time' => '20 menit lalu',
                'agent_id' => 1,
                'resolved' => true
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'alerts' => $alerts,
                'total' => count($alerts),
                'unresolved' => count(array_filter($alerts, fn($a) => !$a['resolved']))
            ]
        ]);
    }

    /**
     * Get agent health status
     */
    public function agentHealth(): JsonResponse
    {
        // Sample data - in production, this would come from database
        $agentHealth = [
            [
                'name' => 'Drone Alpha-1',
                'battery' => 85,
                'signal' => 95,
                'status' => 'active',
                'last_maintenance' => now()->subDays(7)->toDateTimeString()
            ],
            [
                'name' => 'Robot Bravo-1',
                'battery' => 72,
                'signal' => 88,
                'status' => 'active',
                'last_maintenance' => now()->subDays(3)->toDateTimeString()
            ],
            [
                'name' => 'Drone Charlie-1',
                'battery' => 15,
                'signal' => 45,
                'status' => 'warning',
                'last_maintenance' => now()->subDays(14)->toDateTimeString()
            ],
            [
                'name' => 'Robot Delta-1',
                'battery' => 68,
                'signal' => 92,
                'status' => 'in_mission',
                'last_maintenance' => now()->subDays(5)->toDateTimeString()
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'agents' => $agentHealth,
                'total' => count($agentHealth)
            ]
        ]);
    }

    /**
     * Get system activity statistics
     */
    public function systemActivity(): JsonResponse
    {
        // Sample data - in production, this would come from database
        $activityData = [
            ['time' => '00:00', 'operations' => 12, 'runtime' => 85, 'data' => 24],
            ['time' => '04:00', 'operations' => 8, 'runtime' => 90, 'data' => 18],
            ['time' => '08:00', 'operations' => 25, 'runtime' => 75, 'data' => 45],
            ['time' => '12:00', 'operations' => 35, 'runtime' => 68, 'data' => 62],
            ['time' => '16:00', 'operations' => 42, 'runtime' => 55, 'data' => 78],
            ['time' => '20:00', 'operations' => 28, 'runtime' => 72, 'data' => 52],
            ['time' => '24:00', 'operations' => 18, 'runtime' => 82, 'data' => 35]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'activity' => $activityData
            ]
        ]);
    }

    /**
     * Get operational statistics
     */
    public function operationalStats(): JsonResponse
    {
        // Sample data - in production, this would come from database
        $stats = [
            'total_flights' => 128,
            'total_distance' => '1.245 KM',
            'total_runtime' => '86 Jam',
            'data_collected' => '2.4 TB'
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get real-time map data
     */
    public function mapData(): JsonResponse
    {
        // Sample data - in production, this would come from database
        $mapData = [
            'agents' => [
                [
                    'id' => 1,
                    'name' => 'Drone Alpha-1',
                    'type' => 'drone',
                    'location' => ['lat' => -6.2088, 'lng' => 106.8456],
                    'status' => 'active',
                    'altitude' => 120
                ],
                [
                    'id' => 2,
                    'name' => 'Drone Alpha-2',
                    'type' => 'drone',
                    'location' => ['lat' => -6.1751, 'lng' => 106.8650],
                    'status' => 'active',
                    'altitude' => 95
                ],
                [
                    'id' => 3,
                    'name' => 'Robot Bravo-1',
                    'type' => 'robot',
                    'location' => ['lat' => -6.1900, 'lng' => 106.8300],
                    'status' => 'active',
                    'altitude' => 0
                ],
                [
                    'id' => 4,
                    'name' => 'Robot Bravo-2',
                    'type' => 'robot',
                    'location' => ['lat' => -6.2100, 'lng' => 106.8400],
                    'status' => 'active',
                    'altitude' => 0
                ]
            ],
            'geofences' => [
                [
                    'id' => 1,
                    'name' => 'Area A - Sector 1',
                    'coordinates' => [
                        ['lat' => -6.2200, 'lng' => 106.8300],
                        ['lat' => -6.2200, 'lng' => 106.8600],
                        ['lat' => -6.1900, 'lng' => 106.8600],
                        ['lat' => -6.1900, 'lng' => 106.8300]
                    ],
                    'type' => 'restriction'
                ]
            ],
            'mission_routes' => [
                [
                    'id' => 1,
                    'mission_id' => 1,
                    'waypoints' => [
                        ['lat' => -6.2088, 'lng' => 106.8456],
                        ['lat' => -6.1751, 'lng' => 106.8650],
                        ['lat' => -6.1900, 'lng' => 106.8300]
                    ]
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $mapData
        ]);
    }
}