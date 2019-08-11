let HeaderInput = []
let TableInput =[]

HeaderInput.push({
    type: "text",
    title: screenHeader.fields.custom,
    name: screenHeader._id,
    value: header[screenHeader._id],
    onChange: this.handleChangeHeader,
    key: screenHeader._id,    
})


TableInput.push({
    collection: screenHeader.fields.fromTbl,
    objectId: screenBody._id,
    fieldName: screenHeader.fields.name,
    fieldValue: screenBody[screenHeader.fields.name],
    disabled: screenHeader.edit,
    unlocked: unlocked,
    align: screenHeader.align,
    fieldType: "text",
    textNoWrap: true,
    key: screenHeader._id,    
});

