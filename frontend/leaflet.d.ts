import "leaflet";

declare module "leaflet" {
    interface PathOptions {
        smoothFactor?: number;
    }
}

declare module "leaflet-routing-machine" {
    namespace L.Routing {
        interface OSRMv1 {
            _pendingRequest?: any;
        }
    }
}
