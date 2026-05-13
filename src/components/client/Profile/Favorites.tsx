export const Favorites = () => {
    const favorites = [
        {
          name: 'Vanilla Amber Candle',
          price: '$24.00',
        },
        {
          name: 'Cedar + Smoke Candle',
          price: '$28.00',
        },
        {
          name: 'Lavender Linen Candle',
          price: '$22.00',
        },
      ]
      
    return(<section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Favorites</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Products you’ve saved for later.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {favorites.map((product) => (
            <div
              key={product.name}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-neutral-100" />

              <div className="flex-1">
                <p className="font-medium text-neutral-900">
                  {product.name}
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  {product.price}
                </p>
              </div>

              <button className="rounded-full border border-neutral-300 px-3 py-2 text-sm font-medium transition hover:bg-neutral-100">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>)
}