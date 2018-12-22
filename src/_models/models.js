export const project = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		currency: c.currency,
		customer: c.customer,
		customerId: c.customerId,
		erp: c.erp,
		id: c.id,
		isDeleted: c.isDeleted,
		isInspectionModuleEnabled: c.isInspectionModuleEnabled,
		isShippingModuleEnabled: c.isShippingModuleEnabled,
		isWarehouseModuleEnabled: c.isWarehouseModuleEnabled,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		oPCO: c.oPCO,
		opcoId: c.opcoId,
		paymentTerm: c.paymentTerm,
		paymentTermId: c.paymentTermId,
		processingTerm: c.processingTerm,
		processingTermId: c.processingTermId,
		projectOrders: c.projectOrders,
		projectUsers: c.projectUsers,
		stock: c.stock,
		warehouses: c.warehouses,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const projectOrder = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		customerOrderNo: c.customerOrderNo,
		deliveryCondition: c.deliveryCondition,
		description: c.description,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		project: c.project,
		projectId: c.projectId,
		projectOrderLines: c.projectOrderLines,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const projectOrderLine = (c) => {
	return {
		articleNo: c.articleNo,
		clientDescription: c.clientDescription,
		coating: c.coating,
		createDate: c.createDate,
		createdBy: c.createdBy,
		customerCode: c.customerCode,
		deliveryDate: c.deliveryDate,
		description: c.description,
		destination: c.destination,
		deviationRemarks: c.deviationRemarks,
		expeditings: c.expeditings,
		id: c.id,
		isDeleted: c.isDeleted,
		item: c.item,
		material: c.material,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		priority: c.priority,
		projectOrder: c.projectOrder,
		projectOrderId: c.projectOrderId,
		quantity: c.quantity,
		quantityUnit: c.quantityUnit,
		remarks: c.remarks,
		rev: c.rev,
		sapPurchaseLineNo: c.sapPurchaseLineNo,
		sapPurchaseNo: c.sapPurchaseNo,
		sapSalesLineNo: c.sapSalesLineNo,
		sapSalesNo: c.sapSalesNo,
		schedule: c.schedule,
		size: c.size,
		stock: c.stock,
		supplier: c.supplier,
		supplierDeliveryCondition: c.supplierDeliveryCondition,
		supplierOrders: c.supplierOrders,
		type: c.type,
		uDFPO91: c.uDFPO91,
		uDFPO92: c.uDFPO92,
		uDFPO93: c.uDFPO93,
		uDFPO94: c.uDFPO94,
		uDFPO95: c.uDFPO95,
		uDFPO96: c.uDFPO96,
		uDFPO97: c.uDFPO97,
		uDFPO98: c.uDFPO98,
		uDFPO99: c.uDFPO99,
		uDFPOD1: c.uDFPOD1,
		uDFPOD10: c.uDFPOD10,
		uDFPOD2: c.uDFPOD2,
		uDFPOD3: c.uDFPOD3,
		uDFPOD4: c.uDFPOD4,
		uDFPOD5: c.uDFPOD5,
		uDFPOD6: c.uDFPOD6,
		uDFPOD7: c.uDFPOD7,
		uDFPOD8: c.uDFPOD8,
		uDFPOD9: c.uDFPOD9,
		uDFPOX1: c.uDFPOX1,
		uDFPOX10: c.uDFPOX10,
		uDFPOX2: c.uDFPOX2,
		uDFPOX3: c.uDFPOX3,
		uDFPOX4: c.uDFPOX4,
		uDFPOX5: c.uDFPOX5,
		uDFPOX6: c.uDFPOX6,
		uDFPOX7: c.uDFPOX7,
		uDFPOX8: c.uDFPOX8,
		uDFPOX9: c.uDFPOX9,
		unitPrice: c.unitPrice,
		vLSalesLineNo: c.vLSalesLineNo,
		vLSalesNo: c.vLSalesNo,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const projectAdmin = (c) => {
	return {
		id: c.id,
		oPCO: c.oPCO,
		opcoId: c.opcoId,
		userName: c.userName,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const expediting = (c) => {
	return {
		comments: c.comments,
		createDate: c.createDate,
		createdBy: c.createdBy,
		dateDeliveryActual: c.dateDeliveryActual,
		dateDeliveryExpected: c.dateDeliveryExpected,
		dateNfiTarget: c.dateNfiTarget,
		dateReadyForInspectionExpected: c.dateReadyForInspectionExpected,
		dateRfiExpected: c.dateRfiExpected,
		dateShipmentDocsSend: c.dateShipmentDocsSend,
		dateSupplierActual: c.dateSupplierActual,
		dateSupplierExpected: c.dateSupplierExpected,
		id: c.id,
		inspections: c.inspections,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		projectOrderLine: c.projectOrderLine,
		projectOrderLineId: c.projectOrderLineId,
		quantity: c.quantity,
		shippings: c.shippings,
		uDFPO91: c.uDFPO91,
		uDFPO92: c.uDFPO92,
		uDFPO93: c.uDFPO93,
		uDFPO94: c.uDFPO94,
		uDFPO95: c.uDFPO95,
		uDFPO96: c.uDFPO96,
		uDFPO97: c.uDFPO97,
		uDFPO98: c.uDFPO98,
		uDFPO99: c.uDFPO99,
		uDFPOD1: c.uDFPOD1,
		uDFPOD10: c.uDFPOD10,
		uDFPOD2: c.uDFPOD2,
		uDFPOD3: c.uDFPOD3,
		uDFPOD4: c.uDFPOD4,
		uDFPOD5: c.uDFPOD5,
		uDFPOD6: c.uDFPOD6,
		uDFPOD7: c.uDFPOD7,
		uDFPOD8: c.uDFPOD8,
		uDFPOD9: c.uDFPOD9,
		uDFPOX1: c.uDFPOX1,
		uDFPOX10: c.uDFPOX10,
		uDFPOX2: c.uDFPOX2,
		uDFPOX3: c.uDFPOX3,
		uDFPOX4: c.uDFPOX4,
		uDFPOX5: c.uDFPOX5,
		uDFPOX6: c.uDFPOX6,
		uDFPOX7: c.uDFPOX7,
		uDFPOX8: c.uDFPOX8,
		uDFPOX9: c.uDFPOX9,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const inspection = (c) => {
	return {
		certificates: c.certificates,
		comments: c.comments,
		countryOfOrigin: c.countryOfOrigin,
		createDate: c.createDate,
		createdBy: c.createdBy,
		dateInspectionActual: c.dateInspectionActual,
		dateReleasedByInspection: c.dateReleasedByInspection,
		dateReleasedForInspection: c.dateReleasedForInspection,
		expediting: c.expediting,
		expeditingId: c.expeditingId,
		hasCertificates: c.hasCertificates,
		heatNo: c.heatNo,
		id: c.id,
		inspector: c.inspector,
		inspectorId: c.inspectorId,
		isDeleted: c.isDeleted,
		isReleased: c.isReleased,
		manufacturer: c.manufacturer,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		nfiNo: c.nfiNo,
		quantity: c.quantity,
		releasedQuantity: c.releasedQuantity,
		shippings: c.shippings,
		stock: c.stock,
		uDFPO91: c.uDFPO91,
		uDFPO92: c.uDFPO92,
		uDFPO93: c.uDFPO93,
		uDFPO94: c.uDFPO94,
		uDFPO95: c.uDFPO95,
		uDFPO96: c.uDFPO96,
		uDFPO97: c.uDFPO97,
		uDFPO98: c.uDFPO98,
		uDFPO99: c.uDFPO99,
		uDFPOD1: c.uDFPOD1,
		uDFPOD10: c.uDFPOD10,
		uDFPOD2: c.uDFPOD2,
		uDFPOD3: c.uDFPOD3,
		uDFPOD4: c.uDFPOD4,
		uDFPOD5: c.uDFPOD5,
		uDFPOD6: c.uDFPOD6,
		uDFPOD7: c.uDFPOD7,
		uDFPOD8: c.uDFPOD8,
		uDFPOD9: c.uDFPOD9,
		uDFPOX1: c.uDFPOX1,
		uDFPOX10: c.uDFPOX10,
		uDFPOX2: c.uDFPOX2,
		uDFPOX3: c.uDFPOX3,
		uDFPOX4: c.uDFPOX4,
		uDFPOX5: c.uDFPOX5,
		uDFPOX6: c.uDFPOX6,
		uDFPOX7: c.uDFPOX7,
		uDFPOX8: c.uDFPOX8,
		uDFPOX9: c.uDFPOX9,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const shipping = (c) => {
	return {
		comments: c.comments,
		createDate: c.createDate,
		createdBy: c.createdBy,
		expediting: c.expediting,
		expeditingId: c.expeditingId,
		id: c.id,
		inspection: c.inspection,
		inspectionId: c.inspectionId,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		packingListDate: c.packingListDate,
		packingListNo: c.packingListNo,
		project: c.project,
		projectId: c.projectId,
		quantity: c.quantity,
		shippingPackages: c.shippingPackages,
		stockItem: c.stockItem,
		stockItemId: c.stockItemId,
		type: c.type,
		uDFPO91: c.uDFPO91,
		uDFPO92: c.uDFPO92,
		uDFPO93: c.uDFPO93,
		uDFPO94: c.uDFPO94,
		uDFPO95: c.uDFPO95,
		uDFPO96: c.uDFPO96,
		uDFPO97: c.uDFPO97,
		uDFPO98: c.uDFPO98,
		uDFPO99: c.uDFPO99,
		uDFPOD1: c.uDFPOD1,
		uDFPOD10: c.uDFPOD10,
		uDFPOD2: c.uDFPOD2,
		uDFPOD3: c.uDFPOD3,
		uDFPOD4: c.uDFPOD4,
		uDFPOD5: c.uDFPOD5,
		uDFPOD6: c.uDFPOD6,
		uDFPOD7: c.uDFPOD7,
		uDFPOD8: c.uDFPOD8,
		uDFPOD9: c.uDFPOD9,
		uDFPOX1: c.uDFPOX1,
		uDFPOX10: c.uDFPOX10,
		uDFPOX2: c.uDFPOX2,
		uDFPOX3: c.uDFPOX3,
		uDFPOX4: c.uDFPOX4,
		uDFPOX5: c.uDFPOX5,
		uDFPOX6: c.uDFPOX6,
		uDFPOX7: c.uDFPOX7,
		uDFPOX8: c.uDFPOX8,
		uDFPOX9: c.uDFPOX9,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const shippingPackage = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		grossWeight: c.grossWeight,
		height: c.height,
		id: c.id,
		isDeleted: c.isDeleted,
		items: c.items,
		length: c.length,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		nettoWeight: c.nettoWeight,
		packageNo: c.packageNo,
		quantity: c.quantity,
		shipping: c.shipping,
		shippingId: c.shippingId,
		shippingPackageType: c.shippingPackageType,
		shippingPackageTypeId: c.shippingPackageTypeId,
		volume: c.volume,
		width: c.width,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const stockItem = (c) => {
	return {
		articleNo: c.articleNo,
		availableQuantity: c.availableQuantity,
		clientDescription: c.clientDescription,
		coating: c.coating,
		createDate: c.createDate,
		createdBy: c.createdBy,
		customerCode: c.customerCode,
		description: c.description,
		heatNo: c.heatNo,
		id: c.id,
		inspection: c.inspection,
		inspectionId: c.inspectionId,
		isDeleted: c.isDeleted,
		material: c.material,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		pickingListItems: c.pickingListItems,
		project: c.project,
		projectId: c.projectId,
		quantityUnit: c.quantityUnit,
		reservedQuantity: c.reservedQuantity,
		schedule: c.schedule,
		shippings: c.shippings,
		size: c.size,
		stockQuantity: c.stockQuantity,
		type: c.type,
		warehouseLocation: c.warehouseLocation,
		warehouseLocationId: c.warehouseLocationId,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const certificate = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		file: c.file,
		fileContentType: c.fileContentType,
		fileName: c.fileName,
		fileSize: c.fileSize,
		id: c.id,
		inspection: c.inspection,
		inspectionId: c.inspectionId,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const customer = (c) => {
	return {
		address: c.address,
		city: c.city,
		code: c.code,
		contact: c.contact,
		country: c.country,
		createDate: c.createDate,
		createdBy: c.createdBy,
		email: c.email,
		id: c.id,
		invoiceAddress: c.invoiceAddress,
		invoiceCity: c.invoiceCity,
		invoiceCountry: c.invoiceCountry,
		invoiceEmail: c.invoiceEmail,
		invoiceName: c.invoiceName,
		invoicePhone: c.invoicePhone,
		invoiceZip: c.invoiceZip,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		phone: c.phone,
		projects: c.projects,
		vATNo: c.vATNo,
		zip: c.zip,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const user = (c) => {
	return {
		authenticatorSecretKey: c.authenticatorSecretKey,
		email: c.email,
		emailConfirmed: c.emailConfirmed,
		id: c.id,
		isAdmin: c.isAdmin,
		isProjectAdmin: c.isProjectAdmin,
		lockoutEnabled: c.lockoutEnabled,
		phoneNumber: c.phoneNumber,
		phoneNumberConfirmed: c.phoneNumberConfirmed,
		refreshToken: c.refreshToken,
		roles: c.roles,
		twoFactorEnabled: c.twoFactorEnabled,
		userName: c.userName,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const document = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		description: c.description,
		entities: c.entities,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		templates: c.templates,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const gridField = (c) => {
	return {
		entity: c.entity,
		grid: c.grid,
		id: c.id,
		isHidden: c.isHidden,
		isRead: c.isRead,
		isWrite: c.isWrite,
		order: c.order,
		projectId: c.projectId,
		property: c.property,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const inspector = (c) => {
	return {
		code: c.code,
		createDate: c.createDate,
		createdBy: c.createdBy,
		email: c.email,
		fax: c.fax,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		phone: c.phone,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const item = (c) => {
	return {
		coilNo: c.coilNo,
		createDate: c.createDate,
		createdBy: c.createdBy,
		heatNo: c.heatNo,
		id: c.id,
		isDeleted: c.isDeleted,
		length: c.length,
		lengthUnit: c.lengthUnit,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		pipeNo: c.pipeNo,
		quantity: c.quantity,
		receivedDate: c.receivedDate,
		releaseDate: c.releaseDate,
		shippingPackage: c.shippingPackage,
		shippingPackageId: c.shippingPackageId,
		weight: c.weight,
		weightUnit: c.weightUnit,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const oPCO = (c) => {
	return {
		address: c.address,
		city: c.city,
		code: c.code,
		country: c.country,
		createDate: c.createDate,
		createdBy: c.createdBy,
		email: c.email,
		faxNumber: c.faxNumber,
		id: c.id,
		isDeleted: c.isDeleted,
		lat: c.lat,
		lng: c.lng,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		phoneNumber: c.phoneNumber,
		projectAdmins: c.projectAdmins,
		projects: c.projects,
		zip: c.zip,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const paymentTerm = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		description: c.description,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const pickingList = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		isDeleted: c.isDeleted,
		isShipped: c.isShipped,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		pickingListItems: c.pickingListItems,
		project: c.project,
		projectId: c.projectId,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const pickingListItem = (c) => {
	return {
		comments: c.comments,
		id: c.id,
		isPicked: c.isPicked,
		package: c.package,
		pickingList: c.pickingList,
		pickingListId: c.pickingListId,
		quantity: c.quantity,
		shippingPackage: c.shippingPackage,
		shippingPackageId: c.shippingPackageId,
		stockItem: c.stockItem,
		stockItemId: c.stockItemId,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const processingTerm = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		description: c.description,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const projectDuf = (c) => {
	return {
		entity: c.entity,
		id: c.id,
		index: c.index,
		isDefault: c.isDefault,
		label: c.label,
		project: c.project,
		projectId: c.projectId,
		property: c.property,
		type: c.type,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const projectUser = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		project: c.project,
		projectId: c.projectId,
		projectUserRoles: c.projectUserRoles,
		userName: c.userName,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const projectUserRole = (c) => {
	return {
		authorizeDate: c.authorizeDate,
		id: c.id,
		projectUser: c.projectUser,
		projectUserId: c.projectUserId,
		role: c.role,
		roleId: c.roleId,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const shippingPackageType = (c) => {
	return {
		height: c.height,
		id: c.id,
		length: c.length,
		name: c.name,
		shippingPackage: c.shippingPackage,
		width: c.width,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const stockAllocationLog = (c) => {
	return {
		from: c.from,
		id: c.id,
		message: c.message,
		mutQuantity: c.mutQuantity,
		newLocationId: c.newLocationId,
		oldLocationId: c.oldLocationId,
		quantity: c.quantity,
		stockItem: c.stockItem,
		stockItemId: c.stockItemId,
		time: c.time,
		to: c.to,
		userName: c.userName,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const supplier = (c) => {
	return {
		address: c.address,
		city: c.city,
		code: c.code,
		country: c.country,
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		zIP: c.zIP,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const supplierOrder = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const supplierOrderLine = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const tableResult = (c) => {
	return {
		data: c.data,
		totalCount: c.totalCount,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const template = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		document: c.document,
		documentId: c.documentId,
		file: c.file,
		fileContentType: c.fileContentType,
		fileName: c.fileName,
		fileSize: c.fileSize,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		projectId: c.projectId,
		templateRows: c.templateRows,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const templateColumn = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		index: c.index,
		isDeleted: c.isDeleted,
		label: c.label,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		templateRow: c.templateRow,
		templateRowId: c.templateRowId,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const templateRow = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		index: c.index,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		repeat: c.repeat,
		template: c.template,
		templateColumns: c.templateColumns,
		templateId: c.templateId,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const translation = (c) => {
	return {
		abbreviation: c.abbreviation,
		id: c.id,
		label: c.label,
		projectId: c.projectId,
		text: c.text,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const warehouse = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		project: c.project,
		projectId: c.projectId,
		warehouseLocations: c.warehouseLocations,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const warehouseLocation = (c) => {
	return {
		createDate: c.createDate,
		createdBy: c.createdBy,
		id: c.id,
		isDeleted: c.isDeleted,
		modifiedBy: c.modifiedBy,
		modifyDate: c.modifyDate,
		name: c.name,
		warehouse: c.warehouse,
		warehouseId: c.warehouseId,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

export const userTableOption = (c) => {
	return {
		id: c.id,
		options: c.options,
		tableId: c.tableId,
		userName: c.userName,
		filter: null,
		isEditing: false,
		isDirty: false
	};
};

