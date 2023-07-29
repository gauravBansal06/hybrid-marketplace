const { StatusCodes } = require("../constants/http")
const { ValidNameLengths, ValidNameRegexp } = require("../constants/user")
const { GetSellerCatalog, CreateSellerCatalogWithProducts } = require("../repository/catalog")
const { GetSellerById } = require("../repository/user")
const { FormatApiResponse, ValidateAlphaNumericString } = require("../utils/common")

const CreateSellerCatalog = async (catalogReqBody, sellerId) => {
    try {
        //validate request
        const { catalogReq, errorResp } = validateCreateCatalogRequest(catalogReqBody)
        if (errorResp) {
            return errorResp
        }
        const { catalogName, productList } = catalogReq

        //check existing seller catalog
        const existingCatalog = await GetSellerCatalog(sellerId)
        if (existingCatalog.catalog) {
            return FormatApiResponse(StatusCodes.BadRequest, existingCatalog, `Catalog already exists for you!!`)
        }

        //create new catalog with products
        const { catalog, products } = await CreateSellerCatalogWithProducts(catalogName, productList, sellerId)

        const response = {
            catalog,
            products
        }

        return FormatApiResponse(StatusCodes.Success, response, 'Your catalog is created successfully!!')

    } catch (error) {
        return FormatApiResponse(StatusCodes.InternalServerError, null, null, error)
    }
}

const validateCreateCatalogRequest = (catalogReqBody) => {
    const { catalogName, products } = catalogReqBody
    let catalogReq = {
        catalogName: catalogName ? String(catalogName).trim() : "",
        productList: products
    }
    if (catalogReq.catalogName.length > ValidNameLengths.Default || !ValidateAlphaNumericString(catalogReq.catalogName)) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `{catalogName} should be (${ValidNameRegexp}) and max of ${ValidNameLengths.Default} chars!!`) }
    }
    if (!Array.isArray(catalogReq.productList) || catalogReq.productList.length == 0) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `{products} should be non empty array of objects: {name, price} !!`) }
    }

    let updatedProductList = []
    for (let product of catalogReq.productList) {
        let { productReq, errorResp } = validateCreateProductRequest(product)
        if (errorResp) {
            return { errorResp }
        }
        updatedProductList.push(productReq)
    }
    catalogReq.productList = updatedProductList

    return { catalogReq, errorResp: null }
}

const validateCreateProductRequest = (productReqBody) => {
    let { name, price } = productReqBody
    const productReq = {
        name: name ? String(name).trim() : "",
        price: price ? parseFloat(String(price).trim()) : 0
    }
    if (productReq.name.length > ValidNameLengths.Default || !ValidateAlphaNumericString(productReq.name)) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `product name should be (${ValidNameRegexp}) and max of ${ValidNameLengths.Default} chars!!`) }
    }
    if (!productReq.price || productReq.price <= 0) {
        return { errorResp: FormatApiResponse(StatusCodes.BadRequest, null, `product price should be > 0 !!`) }
    }
    return { productReq, errorResp: null }
}

const GetSellerFullCatalog = async (sellerId) => {
    try {
        //check valid seller
        sellerId = String(sellerId).trim()
        const seller = await GetSellerById(sellerId)
        if (!seller) {
            return FormatApiResponse(StatusCodes.BadRequest, null, `Seller - ${sellerId} is not valid!!`)
        }

        //get catalog
        const sellerCatalog = await GetSellerCatalog(sellerId)
        if (!sellerCatalog.catalog) {
            return FormatApiResponse(StatusCodes.Success, null, `Seller - ${sellerId} will come up with catalog soon!!`)
        }
        if (!sellerCatalog.products || sellerCatalog.products.length == 0) {
            return FormatApiResponse(StatusCodes.Success, null, `Seller - ${sellerId} will come up with products soon!! Stay Tuned :)`)
        }

        return FormatApiResponse(StatusCodes.Success, sellerCatalog)

    } catch (error) {
        return FormatApiResponse(StatusCodes.InternalServerError, null, null, error)
    }
}

module.exports = {
    CreateSellerCatalog,
    GetSellerFullCatalog
}