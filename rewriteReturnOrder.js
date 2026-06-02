const fs = require('fs');
const file = 'C:/Users/LENOVO/Desktop/wixty/wrixty-frontend/src/app/return-order/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Imports
content = content.replace(
  'import { fetchProducts } from "../../services/productService";',
  `import { fetchProducts } from "../../services/productService";\nimport { fetchOrders } from "../../services/orderService";\nimport { fetchReturnOrders, createReturnOrderApi, deleteReturnOrderApi } from "../../services/returnOrderService";`
);

// 2. State & Load
const oldStateBlock = `  const [returnOrders, setReturnOrders] = useState<ReturnOrder[]>([
    { id: "1", customerName: "Anil Saxena", phone_number: "9123456780", assginTo: "Aman Sharma", orderDate: "2026-05-20", returnDate: "2026-05-25", product: "Wrixty Neem Blood Purify", amount: 450, quantity: 2, subtotal: 900, type: "Wrong Product Delivered" }
  ]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const toast = useToast();

  React.useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [usersRes, prodsRes] = await Promise.all([
          fetchUsers({ page: 1, limit: 100 }),
          fetchProducts({ page: 1, limit: 100 })
        ]);
        setUsers(usersRes.data);
        setProducts(prodsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMasterData();
  }, []);

  const deleteReturnOrder = (id: string) => {
    setReturnOrders(prev => prev.filter(r => r.id !== id));
  };`;

const newStateBlock = `  const [returnOrders, setReturnOrders] = useState<ReturnOrder[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const toast = useToast();
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadReturnOrdersData = async (searchOverride?: string) => {
    try {
      setIsFetchingData(true);
      const searchToUse = searchOverride !== undefined ? searchOverride : searchQuery;
      const res = await fetchReturnOrders({
        page: 1, limit: 100,
        search: searchToUse || undefined,
        assginTo: filterAssign !== "all" ? filterAssign : undefined,
        product: filterProduct !== "all" ? filterProduct : undefined
      });
      const mapped = res.data.map((r: any) => ({
        id: r._id || r.id,
        customerName: r.customerName,
        phone_number: r.phone_number,
        assginTo: r.assginTo?.name || r.assginTo || "",
        orderDate: r.orderId?.createdAt ? new Date(r.orderId.createdAt).toISOString().split('T')[0] : "-",
        returnDate: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : "",
        product: r.products?.map((p: any) => p.name).join(", ") || "",
        amount: r.amount || 0,
        quantity: r.products?.reduce((acc: number, curr: any) => acc + curr.quantity, 0) || 0,
        subtotal: r.amount || 0,
        type: r.type || "RTO"
      }));
      setReturnOrders(mapped);
    } catch(err) { console.error(err); }
    finally { setIsFetchingData(false); }
  }

  React.useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [usersRes, prodsRes, ordersRes] = await Promise.all([
          fetchUsers({ page: 1, limit: 100 }),
          fetchProducts({ page: 1, limit: 100 }),
          fetchOrders({ page: 1, limit: 1000 })
        ]);
        setUsers(usersRes.data);
        setProducts(prodsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMasterData();
  }, []);
  
  React.useEffect(() => {
    loadReturnOrdersData();
  }, [filterAssign, filterProduct]);

  const deleteReturnOrder = async (id: string) => {
    try {
      await deleteReturnOrderApi(id);
      setReturnOrders(prev => prev.filter(r => r.id !== id));
      toast.warning("Return Order deleted.");
    } catch(err: any) { toast.error("Failed to delete return order"); }
  };`;
content = content.replace(oldStateBlock, newStateBlock);

// 3. Modal Product Handlers
const oldSelectedProductsBlock = `  // For the Add Modal Product Table mock
  const [selectedProducts, setSelectedProducts] = useState([
    { id: "1", name: "", date: "", quantity: 0, subtotal: 0 }
  ]);`;

const newSelectedProductsBlock = `  const [currentSelectedProductId, setCurrentSelectedProductId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const handleAddProduct = () => {
    if (!currentSelectedProductId) return;
    const prod = products.find(p => (p._id || p.id) === currentSelectedProductId);
    if (!prod) return;
    const existing = selectedProducts.find(p => p.productId === currentSelectedProductId);
    if (existing) {
      setSelectedProducts(prev => prev.map(p => p.productId === currentSelectedProductId ? { ...p, quantity: p.quantity + 1, subtotal: (p.quantity + 1) * p.amount } : p));
    } else {
      setSelectedProducts(prev => [...prev, { productId: currentSelectedProductId, name: prod.name, amount: prod.amount, quantity: 1, subtotal: prod.amount }]);
    }
    setCurrentSelectedProductId("");
  };

  const handleRemoveProduct = (id: string) => setSelectedProducts(prev => prev.filter(p => p.productId !== id));
  const handleQtyChange = (id: string, qty: number) => {
    const safeQty = Math.max(1, qty || 1);
    setSelectedProducts(prev => prev.map(p => p.productId === id ? { ...p, quantity: safeQty, subtotal: safeQty * p.amount } : p));
  };

  const convertTotalAmount = selectedProducts.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmitReturnOrder = async () => {
    if(!customer || selectedProducts.length === 0) return toast.error("Please fill customer and add products");
    try {
      await createReturnOrderApi({
        customerName: customer,
        phone_number: phone,
        type: type,
        assginTo: assign || undefined,
        amount: convertTotalAmount,
        products: selectedProducts
      });
      toast.success("Return Order created successfully");
      setAddOpen(false);
      loadReturnOrdersData();
      setCustomer(""); setPhone(""); setSelectedProducts([]);
    } catch(err: any) { toast.error("Failed to create return order"); }
  };`;
content = content.replace(oldSelectedProductsBlock, newSelectedProductsBlock);

// 4. filteredOrders replacement
content = content.replace(/const filteredOrders[\s\S]*?\]\);/, `const filteredOrders = returnOrders;`);

// 5. Apply filters button
content = content.replace(
  '<Button variant="secondary" className="bg-teal-800 hover:bg-teal-700">',
  '<Button variant="secondary" className="bg-teal-800 hover:bg-teal-700" onClick={() => loadReturnOrdersData()}>'
);
content = content.replace(
  '<Button variant="danger" className="bg-rose-500 hover:bg-rose-600">',
  '<Button variant="danger" className="bg-rose-500 hover:bg-rose-600" onClick={() => { setFilterAssign("all"); setFilterOrder("all"); setFilterProduct("all"); setSearchQuery(""); loadReturnOrdersData(""); }}>'
);

// 6. Table replacement
content = content.replace(
  '<Table data={filteredOrders} columns={columns} selectable={false} />',
  `<Table 
    data={filteredOrders} 
    columns={columns} 
    selectable={false} 
    isLoading={isFetchingData}
    searchable={true}
    onSearchChange={(val) => {
      setSearchQuery(val);
      loadReturnOrdersData(val);
    }}
  />`
);

// 7. Customer Dropdown Replacement
const oldCustomerDropdown = `            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500">Customer Name</label>
              <Input placeholder="Enter Customer Name" value={customer} onChange={e => setCustomer(e.target.value)} />
            </div>`;
const newCustomerDropdown = `            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500">Customer Name</label>
              <Select 
                 options={[{ value: "", label: "Select Customer" }, ...Array.from(new Map(orders.map(o => [o.name, o])).values()).map((o: any) => ({ value: o.name, label: o.name }))]}
                 value={customer} 
                 onChange={e => {
                   setCustomer(e.target.value);
                   const o = orders.find(ord => ord.name === e.target.value);
                   if (o) setPhone(o.phone_number);
                 }} 
              />
            </div>`;
content = content.replace(oldCustomerDropdown, newCustomerDropdown);

// 8. Add Product Modal Table Replacement
const oldProductsTable = `          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-700 ">Selected Products</h4>
            <div className="border border-zinc-200  rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white  border-b border-zinc-200  text-zinc-600 ">
                    <th className="p-3 font-semibold w-24">Select</th>
                    <th className="p-3 font-semibold">Product Name</th>
                    <th className="p-3 font-semibold">Order Date</th>
                    <th className="p-3 font-semibold">Quantity</th>
                    <th className="p-3 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white ">
                  <tr className="border-b border-zinc-100 ">
                    <td className="p-3">
                      <input type="checkbox" className="rounded-lg text-teal-800 focus:ring-teal-800" />
                    </td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>`;

const newProductsTable = `          <div className="border-t border-zinc-150 pt-4 space-y-3">
            <h4 className="text-sm font-bold text-zinc-700">Select Products</h4>
            <div className="flex gap-2.5 items-end">
              <div className="flex-1">
                <Select
                  value={currentSelectedProductId}
                  onChange={(e) => setCurrentSelectedProductId(e.target.value)}
                  options={[
                    { value: "", label: "Select a Product" },
                    ...products.map(p => ({ value: p._id || p.id, label: \`\${p.name} (₹\${p.amount})\` }))
                  ]}
                />
              </div>
              <Button type="button" variant="success" className="bg-teal-500 hover:bg-teal-600 border-none px-6 py-2.5" onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-zinc-700 ">Selected Products</h4>
            <div className="border border-zinc-200  rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white border-b border-zinc-200 text-zinc-600 uppercase">
                    <th className="p-3 font-semibold">Product Name</th>
                    <th className="p-3 font-semibold">Amount</th>
                    <th className="p-3 font-semibold w-24">Quantity</th>
                    <th className="p-3 font-semibold">Subtotal</th>
                    <th className="p-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white ">
                  {selectedProducts.length > 0 ? selectedProducts.map(row => (
                    <tr key={row.productId} className="border-b border-zinc-100 ">
                      <td className="p-3">{row.name}</td>
                      <td className="p-3">{row.amount}</td>
                      <td className="p-3">
                        <input type="number" min="1" className="w-16 border border-zinc-200 outline-none rounded px-2 py-1" value={row.quantity} onChange={e => handleQtyChange(row.productId, Number(e.target.value))} />
                      </td>
                      <td className="p-3">{row.subtotal}</td>
                      <td className="p-3">
                         <button onClick={() => handleRemoveProduct(row.productId)} className="text-red-500 hover:text-red-700"><Close className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={5} className="p-6 text-center text-zinc-500 font-medium">No products selected</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>`;
content = content.replace(oldProductsTable, newProductsTable);

// 9. Grand Total and Save Button
content = content.replace('Grand Total: 0.00', 'Grand Total: ₹{convertTotalAmount.toFixed(2)}');
content = content.replace(
  `              onClick={() => {
                toast.success("Return Order created.");
                setAddOpen(false);
              }}`,
  `              onClick={handleSubmitReturnOrder}`
);

fs.writeFileSync(file, content);
console.log("Done");
