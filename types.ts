export type Tenant = {
  id: number;
  name: string;
  sites?: Site[];
  users?: User[];
};

export type Site = {
  id: number;
  name: string;
  tenantId: number;
  tenant?: Tenant;
  unitTypes?: UnitType[];
  equipmentTypes?: EquipmentType[];
  guestTypes?: GuestType[];
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
  siteId: number;
  units?: Unit[];
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
  address2: string;
  townCity: string;
  county: string;
  postcode: string;
  country: string;
  tel: string;
  email: string;
  password: string;
  tenantId: number;
  tenant?: Tenant;
};

export type GuestType = {
  id: number;
  name: string;
  description: string;
  siteId: number;
  site?: Site;
  guests?: LeadGuest[];
};

export type EquipmentType = {
  id: number;
  name: string;
  description: string;
  icon: string;
  siteId: number;
  site?: Site;
};

export type Booking = {
  id: number;
  start: Date;
  end: Date;
  unitId: number;
  unit?: Unit;
  totalFee: number;
  leadGuestId: number;
  leadGuest: LeadGuest;
  guests?: BookingGuest[];
  vehicles?: BookingVehicle[];
  pets?: BookingPet[];
  payments?: Payment[];
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
  age: number;
  start: Date;
  end: Date;
  checkedIn: boolean;
};

export type BookingVehicle = {
  id: number;
  bookingId: number;
  booking?: Booking;
  vehicleReg: string;
  start: Date;
  end: Date;
  checkedIn: boolean;
};

export type BookingPet = {
  id: number;
  bookingId: number;
  booking?: Booking;
  name: string;
  start: Date;
  checkedIn: boolean;
};

export type Payment = {
  id: number;
  createdAt: Date;
  bookingId: number;
  booking?: Booking;
  amount: number;
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
  adults: number;
  children: number;
  infants: number;
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
