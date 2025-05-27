import mongoose from "mongoose";

const routerPermissionSchema = new mongoose.Schema({
  router_endpoint: {
    type: String,
    required: true,
  },
  role: {
    //0,1,2,3
    type: String,
    required: true,
  },
  permission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permission",
    required: true,
  },
  permission: {
    //0,1,2,3
    type: Array,
    required: true,
  },
});
export const RouterPermission = mongoose.model(
  "RouterPermission",
  routerPermissionSchema
);
