
"use client"

import { useState } from 'react';
import { useStore } from '@/hooks/use-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Plus, 
  DoorOpen, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  ChevronRight,
  ArrowLeft,
  Search,
  Info
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { format, parse, differenceInMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function RoomsPage() {
  const { facilities, bookings, upsertFacility, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Add Room Form State
  const [newRoom, setNewRoom] = useState({
    id: '',
    name: '',
    capacity: 20,
    purpose: 'Classroom',
    description: '',
    equipment: ''
  });

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRoom = facilities.find(f => f.id === selectedRoomId);
  
  const roomBookingsOnSelectedDate = bookings.filter(b => 
    b.facilityId === selectedRoomId && 
    b.date === format(selectedDate, 'yyyy-MM-dd') &&
    (b.status === 'confirmed' || b.status === 'pending')
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAddRoom = () => {
    if (!newRoom.id || !newRoom.name) {
      toast({ title: "Incomplete Form", description: "Room ID and Name are required.", variant: "destructive" });
      return;
    }

    upsertFacility({
      ...newRoom,
      equipment: newRoom.equipment.split(',').map(e => e.trim()),
      imageUrl: '',
      description: newRoom.description || `${newRoom.purpose} space.`
    });

    toast({ title: "Room Added", description: `${newRoom.name} is now available in the inventory.` });
    setNewRoom({ id: '', name: '', capacity: 20, purpose: 'Classroom', description: '', equipment: '' });
  };

  // Timeline Helper
  const hours = Array.from({ length: 22 }, (_, i) => i + 1); // Starts at 1 AM, ends with segment starting 10 PM
  const HOUR_HEIGHT = 80;

  const calculateBookingPosition = (startTime: string, endTime: string) => {
    try {
      const start = parse(startTime, 'HH:mm', new Date());
      const end = parse(endTime, 'HH:mm', new Date());
      
      // Calculate minutes from 1:00 AM
      const timelineStart = parse('01:00', 'HH:mm', new Date());
      
      const minutesFromStart = differenceInMinutes(start, timelineStart);
      const durationMinutes = differenceInMinutes(end, start);
      
      const top = (minutesFromStart / 60) * HOUR_HEIGHT;
      const height = (durationMinutes / 60) * HOUR_HEIGHT;
      
      return { top, height };
    } catch (e) {
      return { top: 0, height: 0 };
    }
  };

  if (selectedRoomId && selectedRoom) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedRoomId(null)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Rooms
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-secondary text-secondary font-bold">
              {selectedRoom.purpose}
            </Badge>
            <h2 className="text-xl font-bold">{selectedRoom.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <Card className="lg:col-span-4 border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-6 bg-white">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border-none p-0 w-full"
                showOutsideDays={false}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-8 border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-accent/10">
              <div>
                <CardTitle className="text-lg text-primary">Timeline: {format(selectedDate, 'MMMM d')}</CardTitle>
                <CardDescription>1:00 AM to 11:00 PM</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#dcfce7] border border-green-300" /> 
                  <span className="text-green-800">Confirmed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500" /> 
                  <span className="text-yellow-800">Pending</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] w-full">
                <div className="relative p-6 pr-10">
                  {/* Timeline Grid */}
                  <div className="relative">
                    {hours.map((hour) => {
                      const displayHour = hour > 12 ? hour - 12 : hour;
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      return (
                        <div 
                          key={hour} 
                          className="flex items-start border-t border-dashed border-muted-foreground/20"
                          style={{ height: `${HOUR_HEIGHT}px` }}
                        >
                          <span className="text-[10px] font-bold text-muted-foreground -mt-2 w-12 flex-shrink-0">
                            {displayHour}:00 {ampm}
                          </span>
                        </div>
                      );
                    })}
                    
                    {/* Final 11 PM marker */}
                    <div className="flex items-start border-t border-dashed border-muted-foreground/20 w-full absolute bottom-0">
                      <span className="text-[10px] font-bold text-muted-foreground -mt-2 w-12 flex-shrink-0">
                        11:00 PM
                      </span>
                    </div>

                    {/* Bookings Layer */}
                    <div className="absolute top-0 left-12 right-0 bottom-0 pointer-events-none">
                      {roomBookingsOnSelectedDate.map((booking) => {
                        const { top, height } = calculateBookingPosition(booking.startTime, booking.endTime);
                        
                        // We only show bookings that fall within the visible range
                        if (height <= 0) return null;

                        return (
                          <div
                            key={booking.id}
                            className={cn(
                              "absolute left-2 right-2 rounded-lg p-3 shadow-sm border pointer-events-auto transition-all hover:scale-[1.01] overflow-hidden",
                              booking.status === 'confirmed' 
                                ? "bg-[#dcfce7] text-green-900 border-green-200" 
                                : "bg-yellow-400 text-yellow-900 border-yellow-500/30"
                            )}
                            style={{ 
                              top: `${top}px`, 
                              height: `${height}px`,
                              zIndex: 10 
                            }}
                          >
                            <div className="flex flex-col h-full justify-center">
                              <p className="text-xs font-black uppercase leading-tight text-center">
                                {booking.purpose}
                              </p>
                              <div className="flex justify-between items-end opacity-80 mt-1">
                                <span className="text-[9px] font-bold">
                                  {booking.startTime} - {booking.endTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              {roomBookingsOnSelectedDate.length === 0 && (
                <div className="p-8 text-center bg-accent/5 border-t">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" /> No bookings recorded for this date.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <DoorOpen className="w-8 h-8 text-secondary" />
            Campus Rooms
          </h1>
          <p className="text-muted-foreground">Manage inventory and view detailed room schedules.</p>
        </div>

        {currentUser?.role === 'admin' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:opacity-90 shadow-lg px-6 h-11">
                <Plus className="w-4 h-4 mr-2" /> Add New Room
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Facility Record</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rid">Room ID (e.g. R101)</Label>
                  <Input id="rid" value={newRoom.id} onChange={(e) => setNewRoom({...newRoom, id: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rname">Display Name</Label>
                  <Input id="rname" value={newRoom.name} onChange={(e) => setNewRoom({...newRoom, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rcap">Capacity</Label>
                    <Input id="rcap" type="number" value={newRoom.capacity} onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rcat">Category</Label>
                    <Input id="rcat" value={newRoom.purpose} onChange={(e) => setNewRoom({...newRoom, purpose: e.target.value})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="req">Equipment (Comma separated)</Label>
                  <Input id="req" placeholder="TV, Whiteboard, PCs" value={newRoom.equipment} onChange={(e) => setNewRoom({...newRoom, equipment: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddRoom} className="w-full bg-secondary text-white h-11 text-base">Save Facility</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by room name or ID..." 
          className="pl-10 bg-white border-none shadow-sm h-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((room) => (
          <Card 
            key={room.id} 
            className="group cursor-pointer border-none shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
            onClick={() => setSelectedRoomId(room.id)}
          >
            <div className="h-2 bg-primary group-hover:bg-secondary transition-colors" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2 text-[10px] uppercase font-bold tracking-wider opacity-60">
                    {room.purpose}
                  </Badge>
                  <CardTitle className="text-xl font-bold">{room.name}</CardTitle>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{room.capacity} Chairs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DoorOpen className="w-4 h-4" />
                  <span>{room.id}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {room.equipment.slice(0, 3).map((eq) => (
                  <span key={eq} className="text-[10px] bg-accent/50 px-2 py-0.5 rounded font-medium">
                    {eq}
                  </span>
                ))}
                {room.equipment.length > 3 && (
                  <span className="text-[10px] text-muted-foreground px-1">+{room.equipment.length - 3} more</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
