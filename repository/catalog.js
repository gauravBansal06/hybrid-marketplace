const { sequelize } = require("../config/database")
const { Catalog, Product, Seller } = require("../models")

const createCatalog = async (name, sellerId, transaction = null) => {
    return Catalog.create({
        name: name,
        sellerId: sellerId,
        isActive: true
    }, { transaction })
}

const createProduct = async (name, price, catalogId, transaction = null) => {
    return Product.create({
        name: name,
        price: price,
        catalogId: catalogId,
        isActive: true
    }, { transaction })
}

const CreateSellerCatalogWithProducts = async (catalogName, productList, sellerId) => {
    const transaction = await sequelize.transaction()
    try {
        const catalog = await createCatalog(catalogName, sellerId, transaction)
        let products = []
        for (const productReq of productList) {
            const product = await createProduct(productReq.name, productReq.price, catalog.id, transaction)
            products.push(product)
        }
        await transaction.commit()
        return { catalog, products }
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

const getCatalogBySellerId = async (sellerId) => {
    return Catalog.findOne({
        where: {
            sellerId: sellerId,
            isActive: true
        }
    })
}

const GetSellerCatalog = async (sellerId) => {
    const catalog = await getCatalogBySellerId(sellerId)
    const products = catalog ? await catalog.getProducts() : []
    return { catalog, products }
}

module.exports = {
    CreateSellerCatalogWithProducts,
    GetSellerCatalog
}