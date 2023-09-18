export type Tenant = {
    id: number,
    name: string
}

export type Site = {
    id: number,
    name: string,
    tenantId: number
}

export type User = {
    id: number,
    username: string,
    password: string,
    tenantId: number,
    name: string,
    email: string
}

export type Role = {
    id: number,
    name: string
}

export type UserRoleMap = {
    id: number,
    userId: number,
    roleId: number
}

export type UnitType = {
    id: number,
    name: string,
    siteId: number
}

export type Unit = {
    id: number,
    name: string,
    unitTypeId: number
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
    password: string
}

export type Vehicle = {
    id: number,
    vehReg: string
}

export type Pet = {
    id: number,
    name: string
}

export type Booking = {
    id: number,
    start: Date,
    end: Date,
    unitId: number, 
    totalFee: number,
    leadGuestId: number,
}

export type Calendar = {
    id: string,
    date: Date,
    unitId: number,
    bookingId?: number
}

export type BookingGuestMap = {
    id: number,
    bookingId: number,
    guestId: number,
    start: Date,
    end: Date
}

export type BookingVehicleMap = {
    id: number,
    bookingId: number,
    vehicleId: number,
    start: Date,
    end: Date
}

export type BookingPetMap = {
    id: number,
    bookingId: number,
    petId: number,
    start: Date,
    end: Date
}

export type Payment = {
    id: number,
    createdAt: Date,
    bookingId: number,
    amount: number
}
