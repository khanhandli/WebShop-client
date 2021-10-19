import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { ContextHook } from '../../../ContextHook';
import Loading from '../ultils/loading/Loading';
import ProductItem from '../ultils/ProductItem/ProductItem';
const drawerWidth = 240;
function Products() {
    const state = useContext(ContextHook);
    const [products, setProducts] = state.productsAPI.products;
    const [openDrawer, setOpenDrawer] = state.drawer;
    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;
    const [callback, setCallback] = state.productsAPI.callback;
    const [category, setCategory] = state.productsAPI.category;
    const [loadingProduct, setLoadingProduct] = state.productsAPI.loading;
    const [categories] = state.categoriesAPI.categories;
    const [loading, setLoading] = useState(false);
    const [isCheck, setIsCheck] = useState(false);

    const handleChangeInput = async (id) => {
        products.forEach((product) => {
            if (product._id === id) product.checked = !product.checked;
        });
        setProducts([...products]);
    };

    const deleteProduct = async (id, public_id) => {
        try {
            setLoading(true);
            const destroyImg = await axios.post(
                '/api/destroy',
                { public_id },
                {
                    headers: { Authorization: token },
                }
            );

            const deleteProduct = await axios.delete(`/api/products/${id}`, {
                headers: { Authorization: token },
            });

            await destroyImg;
            await deleteProduct;
            setCallback(!callback);
            setLoading(false);

            alert('Xóa thành công.');
        } catch (err) {
            alert(err.response.data.msg);
        }
    };

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const checkAll = () => {
        products.forEach((product) => {
            product.checked = !isCheck;
        });
        setProducts([...products]);
        setIsCheck(!isCheck);
    };

    const deleteAll = () => {
        products.forEach((product) => {
            if (product.checked) deleteProduct(product._id, product.images.public_id);
        });
    };

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
        paddingTop: 10,
    }));
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth - 24,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={openDrawer}
            >
                <DrawerHeader />
                <List>
                    {categories &&
                        categories.map((item, index) => (
                            <ListItem button key={item._id}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItem>
                        ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Main open={openDrawer}>
                <DrawerHeader />
                <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
                    {(loadingProduct || loading ? Array.from(new Array(8)) : products).map((product, index) => {
                        return (
                            <Grid key={index} item md={3}>
                                {product ? (
                                    <Item>
                                        <ProductItem
                                            product={product}
                                            isAdmin={isAdmin}
                                            deleteProduct={deleteProduct}
                                            handleChangeInput={handleChangeInput}
                                        />
                                    </Item>
                                ) : (
                                    <Box sx={{ width: 210, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant="rectangular" width={210} height={118} />

                                        <Box sx={{ pt: 0.5 }}>
                                            <Skeleton />
                                            <Skeleton width="60%" />
                                        </Box>
                                    </Box>
                                )}
                            </Grid>
                        );
                    })}
                </Grid>
            </Main>

            {/* {isAdmin && (
                <div className="delete-all">
                    <span>chọn tất cả</span>
                    <input type="checkbox" checked={isCheck} onChange={checkAll} />
                    <button onClick={deleteAll}>Xóa Tất Cả</button>
                </div>
             <Filter /> 
                
            )} */}

            {/* <LoadMore />
            {products.length === 0 && <Loading />} */}
        </Box>
    );
}

export default Products;
