import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Phone,
  MessageSquare,
  Route,
  Car,
  Fuel,
  Activity
} from 'lucide-react';
import { mockVehicles, mockRoutes, mockTransportAllocations } from '../mock';

const TrackingInterface = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [trackingData, setTrackingData] = useState([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock real-time tracking data
  const generateTrackingData = () => {
    return mockTransportAllocations.map(allocation => {
      const vehicle = mockVehicles.find(v => v.id === allocation.vehicleId);
      const route = mockRoutes.find(r => r.id === allocation.routeId);
      
      // Generate random location and status data
      const statuses = ['On Route', 'At Stop', 'Delayed', 'Completed', 'Emergency'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: allocation.id,
        vehicleId: allocation.vehicleId,
        vehicleNumber: vehicle?.vehicleNumber || 'N/A',
        routeId: allocation.routeId,
        routeName: route?.routeName || 'N/A',
        routeCode: route?.routeCode || 'N/A',
        driverName: allocation.driverName,
        status: randomStatus,
        currentLocation: {
          lat: 28.6139 + (Math.random() - 0.5) * 0.1,
          lng: 77.2090 + (Math.random() - 0.5) * 0.1,
          address: `Location ${Math.floor(Math.random() * 100)}, Delhi`
        },
        currentStop: route?.stops?.[Math.floor(Math.random() * (route.stops.length || 1))]?.name || 'En Route',
        nextStop: route?.stops?.[Math.floor(Math.random() * (route.stops.length || 1))]?.name || 'Destination',
        estimatedArrival: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString(),
        currentOccupancy: Math.floor(Math.random() * (allocation.maxCapacity || 30)),
        maxCapacity: allocation.maxCapacity || 30,
        speed: Math.floor(Math.random() * 60) + 10,
        fuelLevel: Math.floor(Math.random() * 100),
        lastUpdate: new Date(),
        alerts: Math.random() > 0.8 ? ['Traffic ahead', 'Fuel low'] : [],
        emergencyContact: allocation.emergencyContact || '+91-9876543210'
      };
    });
  };

  useEffect(() => {
    // Initial data load
    setTrackingData(generateTrackingData());
    
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        setTrackingData(generateTrackingData());
        setLastUpdated(new Date());
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh]);

  const handleManualRefresh = () => {
    setTrackingData(generateTrackingData());
    setLastUpdated(new Date());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Route': return 'bg-green-500';
      case 'At Stop': return 'bg-blue-500';
      case 'Delayed': return 'bg-yellow-500';
      case 'Completed': return 'bg-gray-500';
      case 'Emergency': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Route': return <Navigation className="h-4 w-4" />;
      case 'At Stop': return <MapPin className="h-4 w-4" />;
      case 'Delayed': return <Clock className="h-4 w-4" />;
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Emergency': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredData = trackingData.filter(item => {
    const matchesSearch = item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVehicle = !selectedVehicle || selectedVehicle === 'all' || item.vehicleId === selectedVehicle;
    const matchesRoute = !selectedRoute || selectedRoute === 'all' || item.routeId === selectedRoute;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesVehicle && matchesRoute && matchesStatus;
  });

  const getOccupancyPercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Real-Time Vehicle Tracking</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="text-sm font-medium">{lastUpdated.toLocaleTimeString()}</span>
              </div>
              <Button
                onClick={handleManualRefresh}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={isAutoRefresh}
                  onChange={(e) => setIsAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm">Auto Refresh</label>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search vehicles, routes, drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {mockVehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleNumber} - {vehicle.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  {mockRoutes.map(route => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.routeCode} - {route.routeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="On Route">On Route</SelectItem>
                  <SelectItem value="At Stop">At Stop</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{filteredData.length}</p>
                <p className="text-sm text-gray-600">Active Vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{filteredData.filter(v => v.status === 'On Route').length}</p>
                <p className="text-sm text-gray-600">On Route</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{filteredData.filter(v => v.status === 'Delayed').length}</p>
                <p className="text-sm text-gray-600">Delayed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{filteredData.filter(v => v.status === 'Emergency').length}</p>
                <p className="text-sm text-gray-600">Emergencies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{filteredData.reduce((sum, v) => sum + v.currentOccupancy, 0)}</p>
                <p className="text-sm text-gray-600">Total Passengers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Tracking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map(vehicle => (
          <Card key={vehicle.id} className="relative">
            {vehicle.alerts.length > 0 && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="animate-pulse">
                  {vehicle.alerts.length} Alert{vehicle.alerts.length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                  <div>
                    <h3 className="font-semibold text-lg">{vehicle.vehicleNumber}</h3>
                    <p className="text-sm text-gray-600">{vehicle.routeCode} - {vehicle.routeName}</p>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center space-x-1">
                  {getStatusIcon(vehicle.status)}
                  <span>{vehicle.status}</span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Driver & Contact Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{vehicle.driverName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Location Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{vehicle.currentLocation.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current Stop:</span>
                    <p className="font-medium">{vehicle.currentStop}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Stop:</span>
                    <p className="font-medium">{vehicle.nextStop}</p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className={`text-sm font-medium ${getOccupancyColor(getOccupancyPercentage(vehicle.currentOccupancy, vehicle.maxCapacity))}`}>
                      {vehicle.currentOccupancy}/{vehicle.maxCapacity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Occupancy</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{vehicle.speed} km/h</span>
                  </div>
                  <p className="text-xs text-gray-600">Speed</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Fuel className="h-4 w-4 text-gray-500" />
                    <span className={`text-sm font-medium ${vehicle.fuelLevel < 20 ? 'text-red-600' : 'text-green-600'}`}>
                      {vehicle.fuelLevel}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Fuel</p>
                </div>
              </div>

              {/* ETA */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">ETA:</span>
                  <span className="text-sm font-medium">{vehicle.estimatedArrival}</span>
                </div>
                <span className="text-xs text-gray-500">
                  Updated: {vehicle.lastUpdate.toLocaleTimeString()}
                </span>
              </div>

              {/* Alerts */}
              {vehicle.alerts.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">Active Alerts</span>
                  </div>
                  <div className="space-y-1">
                    {vehicle.alerts.map((alert, index) => (
                      <Badge key={index} variant="destructive" className="text-xs mr-2">
                        {alert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackingInterface;