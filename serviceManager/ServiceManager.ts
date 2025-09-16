export enum Core {
  id = "core.id",
  ClassName = "core.className",
  Name = "core.name",
  Description = "core.description",
  PujaDescription = "core.pujaDescription",
  Benifits = "core.benifits",
  Temple = "core.temple",
  MetaData = "core.metaData",
  StartPrice = "core.startPrice",
}

export interface TempleMetadata {
  [Core.id]: string;
  [Core.ClassName]: string;
  [Core.Name]: string;
  [Core.Description]: {
    description: string;
  }[];
  [Core.PujaDescription]: {
    lastDate: string;
    description: string;
    pujaName: string;
    metadata: string;
  };
  [Core.StartPrice]: number;
  [Core.Benifits]: {
    name: string;
    benifit: string;
  }[];
  [Core.Temple]: {
    name: string;
    location: string;
    image: string;
    packages: {
      id: string;
      title: string;
      isPopular: boolean;
      name: string;
      price: number;
      description: { id: string | number; detail: string }[];
    }[];
    prasadDelivery: {
      included: boolean;
      deliveryTime: string;
      prasadCharge: number;
      deliveryCharge: number;
    };
    pandit: {
      name: string;
      about: string;
    };
    extraInfo: Record<string, any>;
  };
  [Core.MetaData]: Record<string, any>;
}

class ServiceManager {
  private static instance: ServiceManager;
  private templeList: TempleMetadata[];

  private constructor() {
    this.templeList = [];
  }

  public static getInstance() {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  public async getTempleList(): Promise<TempleMetadata[]> {
    return this.templeList;
  }
}
export default ServiceManager;
