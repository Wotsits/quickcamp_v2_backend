export type Tenant = {
    id: number,
    name: string,
    sites?: Site[],
    users?: User[],
}

export type Site = {
    id: number,
    name: string,
    tenantId: number,
    tenant?: Tenant,
}

export type User = {
    id: number,
    username: string,
    password: string,
    tenantId: number,
    tenant: Tenant,
    name: string,
    email: string
    roles?: Role[]
}

export type Role = {
    id: number,
    role: string,
    userId: number,
}

export type UnitType = {
    id: number,
    name: string,
    siteId: number,
    units?: Unit[]
}

export type Unit = {
    id: number,
    name: string,
    unitTypeId: number,
    unitType?: UnitType
}

export type Guest = {
    id: number,
    firstName: string,
    lastName: string,
    address1: string,
    address2: string,
    townCity: string,
    postcode: string,
    tel: string,
    email: string,
    password: string,
    tenantId: number,
    tenant?: Tenant
}

export type Booking = {
    id: number,
    start: Date,
    end: Date,
    unitId: number, 
    totalFee: number,
    leadGuestId: number,
    leadGuest: Guest,
    guests?: BookingGuest[],
    vehicles?: BookingVehicle[],
    pets?: BookingPet[],
    payments?: Payment[],
}

export type Calendar = {
    id: string,
    date: Date,
    unitId: number,
    bookingId?: number
}

export type BookingGuest = {
    id: number,
    bookingId: number,
    booking?: Booking,
    name: string,
    age: number,
    start: Date,
    end: Date,
    checkedIn: boolean,
}

export type BookingVehicle = {
    id: number,
    bookingId: number,
    booking?: Booking,
    vehReg: string,
    start: Date,
    end: Date,
    checkedIn: boolean,
}

export type BookingPet = {
    id: number,
    bookingId: number,
    booking?: Booking,
    name: string,
    start: Date,
    checkedIn: boolean,
}

export type Payment = {
    id: number,
    createdAt: Date,
    bookingId: number,
    booking?: Booking,
    amount: number
}
