
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
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
          <Card className="lg:col-span-5 border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Select Date
              </CardTitle>
              <CardDescription className="text-white/70">Pick a day to view its schedule.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6 bg-white">
              <div className="w-full max-w-xs mx-auto">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border-none p-0"
                  showOutsideDays={false}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7 border-none shadow-xl min-h-[450px]">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-accent/10">
              <div>
                <CardTitle className="text-lg text-primary">Schedule for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
                <CardDescription>All confirmed and pending reservations.</CardDescription>
              </div>
              <Clock className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent className="pt-6">
              {roomBookingsOnSelectedDate.length === 0 ? (
                <div className="py-24 text-center text-muted-foreground border border-dashed rounded-xl flex flex-col items-center justify-center bg-accent/5">
                  <DoorOpen className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="font-bold text-lg text-primary/40">No Bookings Found</p>
                  <p className="text-xs">This room is free for the selected day.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {roomBookingsOnSelectedDate.map((booking) => (
                    <div 
                      key={booking.id} 
                      className={cn(
                        "p-5 rounded-xl border flex items-center justify-between transition-all hover:translate-x-1",
                        booking.status === 'confirmed' ? "bg-secondary/5 border-secondary/30 shadow-sm" : "bg-yellow-50 border-yellow-200"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold shadow-md",
                          booking.status === 'confirmed' ? "bg-secondary" : "bg-yellow-400"
                        )}>
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-base text-primary">{booking.startTime} - {booking.endTime}</h4>
                          <p className="text-sm font-medium text-muted-foreground">{booking.userName}</p>
                          <Badge variant="outline" className="mt-1 text-[10px] uppercase">{booking.purpose}</Badge>
                        </div>
                      </div>
                      <Badge className={cn(
                        "capitalize px-3 py-1",
                        booking.status === 'confirmed' ? "bg-secondary text-secondary-foreground" : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      )}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
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
