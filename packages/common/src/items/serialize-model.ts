import { IModel } from "../types";
import { cloneObject } from "..";
import { IItem } from "@esri/arcgis-rest-types";

interface ISerializedModel extends IItem {
  text: string;
}
/**
 * Given a model, return a serialized clone that can be sent to
 * the items api
 * @param {Object} model Item model {item:{}, data:{}}
 */
export function serializeModel(model: IModel): ISerializedModel {
  const serialized = cloneObject(model.item) as ISerializedModel;
  serialized.text = JSON.stringify(model.data);
  return serialized;
}
