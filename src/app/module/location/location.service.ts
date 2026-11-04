import { prisma } from "../../lib/prisma";
import { Location } from "./location.interface";

const getLocation = async () => {
  const result = await prisma.serviceLocation.findMany();
  return result;
};

const createLocation = async (payload: Location) => {
  const {
    label,
    addressLine,
    area,
    ward,
    city,
    postalCode,
    latitude,
    longitude,
    landmark,
  } = payload;
  const result = await prisma.serviceLocation.create({
    data: {
      label,
      addressLine,
      area,
      ward,
      city,
      postalCode,
      latitude,
      longitude,
      landmark,
    },
  });
  return result;
};

const updateLocation = async (payload: Location, id: string) => {
  const {
    label,
    addressLine,
    area,
    ward,
    city,
    postalCode,
    latitude,
    longitude,
    landmark,
  } = payload;
  const result = await prisma.serviceLocation.update({
    where: {
      id,
    },
    data: {
      label,
      addressLine,
      area,
      ward,
      city,
      postalCode,
      latitude,
      longitude,
      landmark,
    },
  });
  return result;
};

const deleteLocation = async (id: string) => {
  const result = await prisma.serviceLocation.delete({
    where: {
      id,
    },
  });
  return result;
};

export const LocationServices = {
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
};
