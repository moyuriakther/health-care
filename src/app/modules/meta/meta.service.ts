import { PaymentStatus, UserRole } from "@prisma/client";
import { TUser } from "../../types/user";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: TUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.super_admin:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.admin:
      metaData = getAdminMetaData();
      break;
    case UserRole.doctor:
      metaData = getDoctorMetaData(user as TUser);
      break;
    case UserRole.patient:
      metaData = getPatientMetaData(user as TUser);
      break;
    default:
      throw new Error("Access Denied");
  }
  return metaData;
};

const getSuperAdminMetaData = async () => {
  console.log("super admin");
  const appointmentCount = await prisma.appointment.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const adminCount = await prisma.admin.count();
  const patientCount = await prisma.patient.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });
  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    appointmentCount,
    doctorCount,
    adminCount,
    paymentCount,
    patientCount,
    totalRevenue: totalRevenue._sum.amount,
    barChartData,
    pieChartData,
  };
};
const getAdminMetaData = async () => {
  console.log(" admin");
  const appointmentCount = await prisma.appointment.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const patientCount = await prisma.patient.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });
  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    appointmentCount,
    doctorCount,
    paymentCount,
    patientCount,
    totalRevenue,
    barChartData,
    pieChartData,
  };
};
const getDoctorMetaData = async (user: TUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const patientCountData = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: { id: true },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const totalRevenueData = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });
  const totalRevenue = totalRevenueData._sum.amount;
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });
  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: _count.id,
    }));
  return {
    appointmentCount,
    patientCount: patientCountData.length,
    reviewCount,
    totalRevenue,
    formattedAppointmentStatusDistribution,
  };
};
const getPatientMetaData = async (user: TUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });
  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });
  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });
  const totalRevenueData = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        patientId: patientData.id,
      },
      status: PaymentStatus.PAID,
    },
  });
  const totalRevenue = totalRevenueData._sum.amount;
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });
  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: _count.id,
    }));
  return {
    appointmentCount,
    prescriptionCount,
    totalRevenue,
    reviewCount,
    formattedAppointmentStatusDistribution,
  };
};

const getBarChartData = async () => {
  const appointmentCountByMonth: { month: Date; count: BigInt } =
    await prisma.$queryRaw`
  SELECT DATE_TRUNC('month', "createdAt") as month,
  CAST(COUNT(*) as INTEGER )as count
  FROM "appointments"
  GROUP BY month
  ORDER BY month ASC
  `;
  return appointmentCountByMonth;
};
const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: _count.id,
    }));
  return formattedAppointmentStatusDistribution;
};

export const MetaServices = {
  fetchDashboardMetaData,
};
