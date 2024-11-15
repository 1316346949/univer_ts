import { IResourceManagerService, Inject } from "@univerjs/core";

interface IResource {
  testResource: string;
}

export class CustomerService {
  private _model: IResource = { testResource: "" };

  constructor(
    @Inject(IResourceManagerService)
    private _resourceManagerService: IResourceManagerService
  ) {}

  alert(_unitID: string) {
    alert(_unitID);
  }

  private _parseJson(json: string) {
    return JSON.parse(json);
  }
}
