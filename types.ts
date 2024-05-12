export type Tenant = {
  id: number;
  name: string;
  sites?: Site[];
  users?: User[];
};

export type Site = {
  id: number;
  name: string;
  description: string;
  address1: string;
  address2?: string | null;
  townCity: string;
  county: string;
  postcode: string;
  country: string;
  email: string;
  tel: string;
  website: string;
  latitude: number;
  longitude: number;
  tenantId: number;
  tenant?: Tenant;
  unitTypes?: UnitType[];
  equipmentTypes?: EquipmentType[];
  guestTypeGroups?: GuestTypeGroup[];
};

export type User = {
  id: number;
  username: string;
  password: string;
  tenantId: number;
  tenant: Tenant;
  name: string;
  email: string;
  roles?: Role[];
};

export type Role = {
  id: number;
  role: string;
  userId: number;
};

export type UnitType = {
  id: number;
  name: string;
  description: string;
  siteId: number;
  units?: Unit[];
  extraTypes?: ExtraType[];
  unitTypeFeesCalendarEntries?: UnitTypeFeesCalendar[];
  guestFeesCalendarEntries?: GuestFeesCalendar[];
  petFeesCalendarEntries?: PetFeesCalendar[];
  vehicleFeesCalendarEntries?: VehicleFeesCalendar[];
  extraFeesCalendarEntries?: ExtraFeesCalendar[];
};

export type Unit = {
  id: number;
  name: string;
  unitTypeId: number;
  unitType?: UnitType;
};

export type LeadGuest = {
  id: number;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  townCity: string;
  county: string;
  postcode: string;
  country: string;
  tel: string;
  email: string;
  password: string;
  tenantId: number;
  tenant?: Tenant;
  bookings?: Booking[];
  notes?: Note[];
};

export type GuestTypeGroup = {
  id: number;
  name: string;
  siteId: number;
  site?: Site;
  order: number;
  getAndReportArrivalTime: boolean;
  guestTypes: GuestType[]
}

export type GuestType = {
  id: number;
  name: string;
  description: string;
  icon: string;
  identifierLabel: string;
  guestTypeGroupId: number;
  guestTypeGroup?: GuestTypeGroup;
  bookingGuests?: BookingGuest[];
  feesCalendarEntries: GuestFeesCalendar[];
};

export type EquipmentType = {
  id: number;
  name: string;
  description: string;
  icon: string;
  siteId: number;
  site?: Site;
};

export type ExtraType = {
  id: number;
  name: string;
  description: string;
  icon: string;
  unitTypeId: number;
  unitTypes?: UnitType[];
};

export type Booking = {
  id: number;
  start: Date;
  end: Date;
  unitId: number;
  unit: Unit;
  totalFee: number;
  leadGuestId: number;
  leadGuest: LeadGuest;
  guests?: BookingGuest[];
  payments?: Payment[];
  status: string;
};

export type Calendar = {
  id: string;
  date: Date;
  unitId: number;
  bookingId?: number;
};

export type BookingGuest = {
  id: number;
  bookingId: number;
  booking?: Booking;
  name: string;
  guestTypeId: number;
  guestType?: GuestType;
  start: Date;
  end: Date;
  arrivalTime?: string;
  checkedIn: Date | null;
  checkedOut: Date | null;
};

export type Payment = {
  id: number;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: string;
  paymentNotes: string;
  bookingId: number;
  booking?: Booking;
};

export type UnitTypeFeesCalendar = {
  id: number;
  date: Date;
  unitType: UnitType;
  unitTypeId: number;
  feePerNight: number;
  feePerStay: number;
};

export type GuestFeesCalendar = {
  id: number;
  date: Date;
  guestType: GuestType;
  guestTypeId: number;
  unitType: UnitType;
  unitTypeId: number;
  feePerNight: number;
  feePerStay: number;
};

export type PetFeesCalendar = {
  id: number;
  date: Date;
  unitType: UnitType;
  unitTypeId: number;
  feePerNight: number;
  feePerStay: number;
};

export type VehicleFeesCalendar = {
  id: number;
  date: Date;
  unitType: UnitType;
  unitTypeId: number;
  feePerNight: number;
  feePerStay: number;
};

export type ExtraFeesCalendar = {
  id: number;
  date: Date;
  extraType: ExtraType;
  extraTypeId: number;
  unitType: UnitType;
  unitTypeId: number;
  feePerNight: number;
  feePerStay: number;
};

export type Note = {
  id: number;
  content: string;
  leadGuestId?: number;
  leadGuest?: LeadGuest;
  bookingId?: number;
  booking?: Booking;
  paymentId?: number;
  payment?: Payment;
  bookingGuestId?: number;
  bookingGuest?: BookingGuest;
  createdOn: Date;
  userId: number;
  user: User;
  noteType: "PUBLIC" | "PRIVATE";
};


// ----------------- RESPONSES -----------------

export type UserResponse = {
  message: string;
  name: string;
  refreshToken: string;
  roles: Role[];
  sites: Site[];
  tenantId: number;
  token: string;
  username: string;
  id: number;
};

export type FeeCalcResponse = {
  data: {
    status: "SUCCESS" | "ERROR";
    message: string;
    totalFee: number;
  };
};

export type BookingSumm = {
  id: any;
  bookingName: string;
  guests: {
    [key: string]: number
  }
  pets: number;
  vehicles: number;
  unit: number;
  start: string;
  end: string;
  paid: boolean;
  peopleCheckedIn: number;
  petsCheckedIn: number;
  vehiclesCheckedIn: number;
};

export type BookingProcessGuest = {
  id: string;
  name: string;
  guestTypeId: string;
};

export type BookingProcessVehicle = {
  id: string;
  vehicleReg: string;
};

export type BookingProcessPet = {
  id: string;
  name: string;
};
