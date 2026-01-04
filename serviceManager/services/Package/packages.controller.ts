import { PackageAPI } from "./packages.api";
import type { PackageProps } from "./packages.types";

export class PackageController {
  private static instance: PackageController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new PackageController();
    }
    return this.instance;
  }

  async getPackages(): Promise<PackageProps[]> {
    return PackageAPI.getPackages();
  }

  async updatePackage(payload: PackageProps): Promise<PackageProps> {
    return PackageAPI.updatePackage(payload);
  }

  async deletePackage({ id }: { id: string }): Promise<PackageProps> {
    return PackageAPI.deletePackage({ id });
  }

  async createPackage(payload: PackageProps): Promise<PackageProps> {
    return PackageAPI.createPackage(payload);
  }

  async getByIds({ ids }: { ids: string[] }): Promise<PackageProps[]> {
    return PackageAPI.getByIds({ ids });
  }
}
