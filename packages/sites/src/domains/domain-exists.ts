import { IHubRequestOptions, stripProtocol } from "@esri/hub-common";
import { _getDomainServiceUrl } from "./_get-domain-service-url";
import { _getAuthHeader } from "./_get-auth-header";

/**
 * Check if a domain entry exists. Different from lookupDomain
 * in that this will return true/false, where as lookupDomain will
 * return the domain entry or throw. However, lookupDomain can work
 * with ArcGIS Enterprise.
 * Will throw if used in Portal.
 * @param {string} domain Domain entry to check for
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function domainExists(
  domain: string,
  hubRequestOptions: IHubRequestOptions
) {
  if (hubRequestOptions.isPortal) {
    throw new Error(`domainExists is not available in ArcGIS Enterprise.`);
  }
  domain = stripProtocol(domain);
  const url = `${_getDomainServiceUrl(hubRequestOptions.hubApiUrl)}/${domain}`;
  const headers = _getAuthHeader(hubRequestOptions);
  return fetch(url, { method: "GET", headers, mode: "cors" }).then(
    response => response.status !== 404
  );
}
