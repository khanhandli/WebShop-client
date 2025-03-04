import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContextHook } from '../../../ContextHook';
import ProductItem from '../ultils/ProductItem/ProductItem';
import FilterCategory from './FilterCategory';
import FilterSort from './FilterSort';
import LoadMore from './LoadMore';

const drawerWidth = 240;
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Products() {
    const { enqueueSnackbar } = useSnackbar();

    const state = useContext(ContextHook);
    const [products, setProducts] = state.productsAPI.products;
    const [openDrawer, setOpenDrawer] = state.drawer;
    const [isAdmin] = state.userAPI.isAdmin;
    const [page, setPage] = state.productsAPI.page;
    const addCart = state.userAPI.addCart;

    const [token] = state.token;
    const [callback, setCallback] = state.productsAPI.callback;
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

            enqueueSnackbar('Xóa thành công.', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
        } catch (err) {
            enqueueSnackbar(err?.response?.data?.msg, {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
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
        marginLeft: `-${216}px`,
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

    useEffect(() => {
        setPage(1);
    }, []);

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
                className="custome_drawer"
            >
                <DrawerHeader />
                {categories && categories.length > 0 ? (
                    <>
                        <span className="category_list">Danh mục sản phẩm</span>
                        <FilterCategory />
                    </>
                ) : (
                    <>
                        <Skeleton height={30} />
                        <Box justifyContent="center" style={{ padding: '0 10px' }}>
                            {Array.from(new Array(14)).map((item, index) => (
                                <Stack direction="row" spacing={3} key={index} style={{ marginBottom: '3px' }}>
                                    <Skeleton animation="wave" variant="circular" width={38} height={38} />{' '}
                                    <Skeleton animation="wave" height={38} width={180} />
                                </Stack>
                            ))}
                        </Box>
                    </>
                )}
                {categories && categories.length > 0 && (
                    <>
                        {/* <Divider /> */}
                        {/* <List>
                            {['All mail', 'Trash', 'Spam'].map((text, index) => (
                                <ListItem button key={index}>
                                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List> */}
                        {isAdmin && (
                            <>
                                <Divider />
                                <List>
                                    {[
                                        <FormControlLabel
                                            style={{ paddingLeft: '10px' }}
                                            label="Chọn tất cả"
                                            control={
                                                <Checkbox
                                                    checked={isCheck}
                                                    {...label}
                                                    style={{ display: 'none' }}
                                                    onChange={checkAll}
                                                />
                                            }
                                        />,
                                        <span style={{ fontSize: '1.05rem', fontWeight: 400 }} onClick={deleteAll}>
                                            Xóa tất cả
                                        </span>,
                                    ].map((text, index) => (
                                        <ListItem button key={index}>
                                            <ListItemIcon>
                                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                            </ListItemIcon>
                                            <ListItemText primary="Inbox" primary={text} />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </>
                )}
            </Drawer>
            <Main open={openDrawer}>
                <DrawerHeader />
                <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                    {categories && categories.length > 0 ? (
                        <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
                            <Item>
                                <FilterSort />
                            </Item>
                        </Grid>
                    ) : (
                        <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
                            <Skeleton animation="wave" height={24} width={40} />
                            <Skeleton animation="wave" height={24} width={180} />
                        </Grid>
                    )}

                    {(loadingProduct || loading ? Array.from(new Array(8)) : products).map((product, index) => {
                        return (
                            <Grid key={index} item lg={3} xl={3} md={4} sm={6} xs={12}>
                                {product ? (
                                    <Item className="item_product">
                                        <ProductItem
                                            product={product}
                                            isAdmin={isAdmin}
                                            deleteProduct={deleteProduct}
                                            handleChangeInput={handleChangeInput}
                                            addCart={addCart}
                                        />
                                    </Item>
                                ) : (
                                    <Box sx={{ width: 210, marginRight: 0.5, my: 5 }}>
                                        <Skeleton animation="wave" variant="rectangular" width={210} height={118} />

                                        <Box sx={{ pt: 0.5 }}>
                                            <Skeleton animation="wave" />
                                            <Skeleton animation="wave" width="60%" />
                                        </Box>
                                    </Box>
                                )}
                            </Grid>
                        );
                    })}
                </Grid>
                <LoadMore />

                {products.length === 0 && <div style={{ textAlign: 'center' }}>Chưa có sản phẩm!</div>}
            </Main>

            {/* {isAdmin && (
                <div className="delete-all">
                    <span>chọn tất cả</span>
                    <input type="checkbox" checked={isCheck} onChange={checkAll} />
                    <button onClick={deleteAll}>Xóa Tất Cả</button>
                </div>
             <Filter /> 
                
            )} */}
        </Box>
    );
}

export default Products;
