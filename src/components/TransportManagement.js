import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Car,
  Users,
  Route,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  DollarSign,
  FileText
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import { mockVehicles, mockDrivers, mockRoutes, mockTransportAllocations } from '../mock';
import VehicleForm from './VehicleForm';
import DriverForm from './DriverForm';
import RouteForm from './RouteForm';
import AllocationForm from './AllocationForm';
import TrackingInterface from './TrackingInterface';
import MaintenanceSystem from './MaintenanceSystem';
import TransportReports from './TransportReports';
import DriverPayment from './DriverPayment';

const TransportManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('fleet');
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [drivers, setDrivers] = useState(mockDrivers);
  const [routes, setRoutes] = useState(mockRoutes);
  const [allocations, setAllocations] = useState(mockTransportAllocations);
  
  // Dialog states
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  
  // Edit states
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingDriver, setEditingDriver] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [editingAllocation, setEditingAllocation] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');



  // Vehicle management functions
  const handleAddVehicle = (vehicleData) => {
    const newVehicle = {
      ...vehicleData,
      id: 'VH' + String(vehicles.length + 1).padStart(3, '0'),
      status: 'Available'
    };
    setVehicles([...vehicles, newVehicle]);
    setIsVehicleDialogOpen(false);
    toast({
      title: "Vehicle Added",
      description: `Vehicle ${newVehicle.vehicleNumber} has been added successfully.`
    });
  };

  const handleEditVehicle = (vehicleData) => {
    setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...vehicleData, id: editingVehicle.id } : v));
    setEditingVehicle(null);
    setIsVehicleDialogOpen(false);
    toast({
      title: "Vehicle Updated",
      description: "Vehicle information has been updated successfully."
    });
  };

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
    toast({
      title: "Vehicle Deleted",
      description: "Vehicle has been removed from the system."
    });
  };

  // Driver management functions
  const handleAddDriver = (driverData) => {
    const newDriver = {
      ...driverData,
      id: 'DR' + String(drivers.length + 1).padStart(3, '0'),
      rating: 0,
      totalTrips: 0
    };
    setDrivers([...drivers, newDriver]);
    setIsDriverDialogOpen(false);
    toast({
      title: "Driver Added",
      description: `Driver ${newDriver.name} has been added successfully.`
    });
  };

  const handleEditDriver = (driverData) => {
    setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...driverData, id: editingDriver.id } : d));
    setEditingDriver(null);
    setIsDriverDialogOpen(false);
    toast({
      title: "Driver Updated",
      description: "Driver information has been updated successfully."
    });
  };

  const handleDeleteDriver = (driverId) => {
    setDrivers(drivers.filter(d => d.id !== driverId));
    toast({
      title: "Driver Deleted",
      description: "Driver has been removed from the system."
    });
  };

  // Route management functions
  const handleAddRoute = (routeData) => {
    const newRoute = {
      ...routeData,
      id: 'RT' + String(routes.length + 1).padStart(3, '0'),
      status: 'Active'
    };
    setRoutes([...routes, newRoute]);
    setIsRouteDialogOpen(false);
    toast({
      title: "Route Added",
      description: `Route ${newRoute.routeName} has been created successfully.`
    });
  };

  const handleEditRoute = (routeData) => {
    setRoutes(routes.map(r => r.id === editingRoute.id ? { ...routeData, id: editingRoute.id } : r));
    setEditingRoute(null);
    setIsRouteDialogOpen(false);
    toast({
      title: "Route Updated",
      description: "Route information has been updated successfully."
    });
  };

  const handleDeleteRoute = (routeId) => {
    setRoutes(routes.filter(r => r.id !== routeId));
    toast({
      title: "Route Deleted",
      description: "Route has been removed from the system."
    });
  };

  // Allocation management functions
  const handleAddAllocation = (allocationData) => {
    const newAllocation = {
      ...allocationData,
      id: 'AL' + String(allocations.length + 1).padStart(3, '0'),
      status: 'Active'
    };
    setAllocations([...allocations, newAllocation]);
    setIsAllocationDialogOpen(false);
    toast({
      title: "Allocation Created",
      description: "Transport allocation has been created successfully."
    });
  };

  const handleEditAllocation = (allocationData) => {
    setAllocations(allocations.map(a => a.id === editingAllocation.id ? { ...allocationData, id: editingAllocation.id } : a));
    setEditingAllocation(null);
    setIsAllocationDialogOpen(false);
    toast({
      title: "Allocation Updated",
      description: "Transport allocation has been updated successfully."
    });
  };

  const handleDeleteAllocation = (allocationId) => {
    setAllocations(allocations.filter(a => a.id !== allocationId));
    toast({
      title: "Allocation Deleted",
      description: "Transport allocation has been removed."
    });
  };

  // Filter functions
  const getFilteredVehicles = () => {
    return vehicles.filter(vehicle => {
      const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredDrivers = () => {
    return drivers.filter(driver => {
      const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredRoutes = () => {
    return routes.filter(route => {
      const matchesSearch = route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           route.startLocation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredAllocations = () => {
    return allocations.filter(allocation => {
      const matchesSearch = allocation.routeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           allocation.vehicleId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || allocation.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const renderFleetManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fleet Management</h2>
          <p className="text-gray-600">Manage your vehicle fleet and maintenance</p>
        </div>
        <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingVehicle(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            </DialogHeader>
            <VehicleForm
              vehicle={editingVehicle}
              onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
              onCancel={() => {
                setIsVehicleDialogOpen(false);
                setEditingVehicle(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="In Use">In Use</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Out of Service">Out of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredVehicles().map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{vehicle.vehicleNumber}</CardTitle>
                </div>
                <Badge variant={vehicle.status === 'Available' ? 'default' : 
                              vehicle.status === 'In Use' ? 'secondary' : 
                              vehicle.status === 'Maintenance' ? 'destructive' : 'outline'}>
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-medium">{vehicle.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Capacity</p>
                  <p className="font-medium">{vehicle.capacity} seats</p>
                </div>
                <div>
                  <p className="text-gray-600">Driver</p>
                  <p className="font-medium">{vehicle.driverName || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Route</p>
                  <p className="font-medium">{vehicle.routeAssigned || 'Unassigned'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setIsVehicleDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDriverManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Driver Management</h2>
          <p className="text-gray-600">Manage driver profiles and assignments</p>
        </div>
        <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDriver(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
            </DialogHeader>
            <DriverForm
              driver={editingDriver}
              onSubmit={editingDriver ? handleEditDriver : handleAddDriver}
              onCancel={() => {
                setIsDriverDialogOpen(false);
                setEditingDriver(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="On Leave">On Leave</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Driver Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredDrivers().map((driver) => (
          <Card key={driver.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">{driver.name}</CardTitle>
                </div>
                <Badge variant={driver.status === 'Active' ? 'default' : 
                              driver.status === 'On Leave' ? 'secondary' : 'destructive'}>
                  {driver.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">License</p>
                  <p className="font-medium">{driver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Experience</p>
                  <p className="font-medium">{driver.experience} years</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{driver.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Vehicle</p>
                  <p className="font-medium">{driver.assignedVehicle || 'Unassigned'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingDriver(driver);
                      setIsDriverDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteDriver(driver.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4 mr-1" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transport Management</h1>
          <p className="text-gray-600">Comprehensive transport and fleet management system</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
             <FileText className="h-4 w-4" />
             <span>Reports</span>
           </TabsTrigger>
           <TabsTrigger value="payments" className="flex items-center space-x-2">
             <DollarSign className="h-4 w-4" />
             <span>Driver Payments</span>
           </TabsTrigger>
        </TabsList>

        <TabsContent value="fleet">
          {renderFleetManagement()}
        </TabsContent>

        <TabsContent value="drivers">
          {renderDriverManagement()}
        </TabsContent>

        <TabsContent value="routes">
           <div className="space-y-6">
             {/* Header */}
             <div className="flex items-center justify-between">
               <div>
                 <h2 className="text-2xl font-bold">Route Management</h2>
                 <p className="text-gray-600">Manage routes, stops, and pickup points</p>
               </div>
               <Dialog open={isRouteDialogOpen} onOpenChange={setIsRouteDialogOpen}>
                 <DialogTrigger asChild>
                   <Button onClick={() => setEditingRoute(null)}>
                     <Plus className="h-4 w-4 mr-2" />
                     Add Route
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                   <DialogHeader>
                     <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
                   </DialogHeader>
                   <RouteForm
                     route={editingRoute}
                     onSubmit={editingRoute ? handleEditRoute : handleAddRoute}
                     onCancel={() => {
                       setIsRouteDialogOpen(false);
                       setEditingRoute(null);
                     }}
                   />
                 </DialogContent>
               </Dialog>
             </div>

             {/* Search and Filter */}
             <div className="flex items-center space-x-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                 <Input
                   placeholder="Search routes..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10"
                 />
               </div>
               <Select value={filterStatus} onValueChange={setFilterStatus}>
                 <SelectTrigger className="w-48">
                   <Filter className="h-4 w-4 mr-2" />
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Status</SelectItem>
                   <SelectItem value="Active">Active</SelectItem>
                   <SelectItem value="Inactive">Inactive</SelectItem>
                   <SelectItem value="Suspended">Suspended</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             {/* Routes List */}
             <div className="space-y-4">
               {getFilteredRoutes().map((route) => (
                 <Card key={route.id} className="hover:shadow-lg transition-shadow">
                   <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <h3 className="text-lg font-semibold">{route.routeName}</h3>
                         <p className="text-gray-600">{route.routeCode}</p>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Badge variant={route.status === 'Active' ? 'default' : 'secondary'}>
                           {route.status}
                         </Badge>
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => {
                             setEditingRoute(route);
                             setIsRouteDialogOpen(true);
                           }}
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => handleDeleteRoute(route.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                       <div className="flex items-center space-x-2">
                         <MapPin className="h-4 w-4 text-gray-500" />
                         <span className="text-sm">{route.totalDistance} km</span>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Clock className="h-4 w-4 text-gray-500" />
                         <span className="text-sm">{route.estimatedTime} min</span>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Users className="h-4 w-4 text-gray-500" />
                         <span className="text-sm">{route.capacity} capacity</span>
                       </div>
                       <div className="flex items-center space-x-2">
                         <Car className="h-4 w-4 text-gray-500" />
                         <span className="text-sm">{route.vehicleAssigned || 'Unassigned'}</span>
                       </div>
                     </div>
                     
                     <div className="border-t pt-4">
                       <h4 className="font-medium mb-2">Stops ({route.stops?.length || 0})</h4>
                       <div className="flex flex-wrap gap-2">
                         {route.stops?.map((stop, index) => (
                           <Badge key={index} variant="outline" className="text-xs">
                             {index + 1}. {stop.name} ({stop.time})
                           </Badge>
                         )) || <span className="text-gray-500 text-sm">No stops defined</span>}
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </div>
         </TabsContent>

         <TabsContent value="allocations">
           <div className="space-y-6">
             {/* Header */}
             <div className="flex items-center justify-between">
               <div>
                 <h2 className="text-2xl font-bold">Transport Allocations</h2>
                 <p className="text-gray-600">Manage student and staff transport assignments</p>
               </div>
               <Dialog open={isAllocationDialogOpen} onOpenChange={setIsAllocationDialogOpen}>
                 <DialogTrigger asChild>
                   <Button onClick={() => setEditingAllocation(null)}>
                     <Plus className="h-4 w-4 mr-2" />
                     Add Allocation
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                   <DialogHeader>
                     <DialogTitle>{editingAllocation ? 'Edit Allocation' : 'Add New Allocation'}</DialogTitle>
                   </DialogHeader>
                   <AllocationForm
                     allocation={editingAllocation}
                     onSubmit={editingAllocation ? handleEditAllocation : handleAddAllocation}
                     onCancel={() => {
                       setIsAllocationDialogOpen(false);
                       setEditingAllocation(null);
                     }}
                   />
                 </DialogContent>
               </Dialog>
             </div>

             {/* Search and Filter */}
             <div className="flex items-center space-x-4">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                 <Input
                   placeholder="Search allocations..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10"
                 />
               </div>
               <Select value={filterStatus} onValueChange={setFilterStatus}>
                 <SelectTrigger className="w-48">
                   <Filter className="h-4 w-4 mr-2" />
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Status</SelectItem>
                   <SelectItem value="Active">Active</SelectItem>
                   <SelectItem value="Inactive">Inactive</SelectItem>
                   <SelectItem value="Pending">Pending</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             {/* Allocations Table */}
             <Card>
               <CardContent className="p-0">
                 <div className="overflow-x-auto">
                   <table className="w-full border-collapse">
                     <thead>
                       <tr className="border-b bg-gray-50">
                         <th className="text-left p-4 font-medium">Student/Staff</th>
                         <th className="text-left p-4 font-medium">Route</th>
                         <th className="text-left p-4 font-medium">Vehicle</th>
                         <th className="text-left p-4 font-medium">Pickup Point</th>
                         <th className="text-left p-4 font-medium">Status</th>
                         <th className="text-left p-4 font-medium">Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {getFilteredAllocations().map((allocation) => {
                         const route = routes.find(r => r.id === allocation.routeId);
                         const vehicle = vehicles.find(v => v.id === allocation.vehicleId);
                         
                         return (
                           <tr key={allocation.id} className="border-b hover:bg-gray-50">
                             <td className="p-4">
                               <div>
                                 <div className="font-medium">{allocation.studentName || allocation.staffName}</div>
                                 <div className="text-sm text-gray-600">{allocation.studentId || allocation.staffId}</div>
                               </div>
                             </td>
                             <td className="p-4">
                               <div>
                                 <div className="font-medium">{route?.routeName || 'N/A'}</div>
                                 <div className="text-sm text-gray-600">{route?.routeCode || ''}</div>
                               </div>
                             </td>
                             <td className="p-4">{vehicle?.vehicleNumber || 'N/A'}</td>
                             <td className="p-4">{allocation.pickupPoint || 'N/A'}</td>
                             <td className="p-4">
                               <Badge variant={allocation.status === 'Active' ? 'default' : 'secondary'}>
                                 {allocation.status}
                               </Badge>
                             </td>
                             <td className="p-4">
                               <div className="flex space-x-2">
                                 <Button
                                   size="sm"
                                   variant="outline"
                                   onClick={() => {
                                     setEditingAllocation(allocation);
                                     setIsAllocationDialogOpen(true);
                                   }}
                                 >
                                   <Edit className="h-4 w-4" />
                                 </Button>
                                 <Button
                                   size="sm"
                                   variant="outline"
                                   onClick={() => handleDeleteAllocation(allocation.id)}
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </div>
                             </td>
                           </tr>
                         );
                       })}
                     </tbody>
                   </table>
                 </div>
               </CardContent>
             </Card>
           </div>
         </TabsContent>

        <TabsContent value="tracking">
          <TrackingInterface />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceSystem />
        </TabsContent>

        <TabsContent value="reports">
          <TransportReports />
        </TabsContent>

        <TabsContent value="payments">
          <DriverPayment />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportManagement;