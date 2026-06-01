export interface EndPointApi {
  // Products
  products: string;
  productCreate: string;
  productUpdate: string;
  productDelete: string;
  productExport: string;

  // Statuses
  statuses: string;
  statusCreate: string;
  statusUpdate: string;
  statusDelete: string;
  statusExport: string;

  // Return Order Types
  returnOrderTypes: string;
  returnOrderTypeCreate: string;
  returnOrderTypeUpdate: string;
  returnOrderTypeDelete: string;
  returnOrderTypeExport: string;

  // Reason to Calls
  reasonToCalls: string;
  reasonToCallCreate: string;
  reasonToCallUpdate: string;
  reasonToCallDelete: string;
  reasonToCallExport: string;

  // Users
  users: string;
  userCreate: string;
}

const endPointApi: EndPointApi = {
  // Products
  products: 'products',
  productCreate: 'products',
  productUpdate: 'products',
  productDelete: 'products',
  productExport: 'products/export',

  // Statuses
  statuses: 'statuses',
  statusCreate: 'statuses',
  statusUpdate: 'statuses',
  statusDelete: 'statuses',
  statusExport: 'statuses/export',

  // Return Order Types
  returnOrderTypes: 'return-order-types',
  returnOrderTypeCreate: 'return-order-types',
  returnOrderTypeUpdate: 'return-order-types',
  returnOrderTypeDelete: 'return-order-types',
  returnOrderTypeExport: 'return-order-types/export',

  // Reason to Calls
  reasonToCalls: 'reason-to-calls',
  reasonToCallCreate: 'reason-to-calls',
  reasonToCallUpdate: 'reason-to-calls',
  reasonToCallDelete: 'reason-to-calls',
  reasonToCallExport: 'reason-to-calls/export',

  // Users
  users: 'users',
  userCreate: 'users',
};

export default endPointApi;
