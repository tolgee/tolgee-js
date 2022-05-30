type RunnableService = any;

export const runServices = (services: RunnableService[]) => {
  services.forEach((service) => service.run?.());
};

export const stopServices = (services: RunnableService[]) => {
  services.forEach((service) => service.stop?.());
};
