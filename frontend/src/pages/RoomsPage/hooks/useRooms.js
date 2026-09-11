import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchRooms } from '../../../services/api/postApi';
import { DEFAULT_PAGE_SIZE } from '../constants/filterOptions';

export const useRooms = (sort, postType = 'room_rental', showToast) => {
    const [rooms, setRooms] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    console.log('🔄 [useRooms] Hook initialized with postType:', postType);

    useEffect(() => {
        const loadPage = async () => {
            try {
                console.log('🔄 [useRooms] useEffect triggered, postType:', postType);
                const pageParam = parseInt(searchParams.get('page')) || 1;
                const limitParam = parseInt(searchParams.get('limit')) || DEFAULT_PAGE_SIZE;
                const searchQ = searchParams.get('search') || '';
                const searchType = searchParams.get('searchType') || 'title';
                const minPrice = searchParams.get('minPrice');
                const maxPrice = searchParams.get('maxPrice');
                const minArea = searchParams.get('minArea');
                const maxArea = searchParams.get('maxArea');
                const city = searchParams.get('city');
                const district = searchParams.get('district');
                const ward = searchParams.get('ward');
                const types = searchParams.get('types');
                const utilities = searchParams.get('utilities');
                const sortQ = searchParams.get('sort') || sort;
                // KHÔNG đọc textSearchAI từ URL params nữa

                console.log('🚀 [FRONTEND] useRooms calling fetchRooms with utilities:', utilities);
                console.log('🚀 [FRONTEND] Full search params:', {
                    page: pageParam,
                    utilities,
                    types,
                    search: searchQ
                });

                const res = await fetchRooms({
                    page: pageParam,
                    limit: limitParam,
                    search: searchQ,
                    searchType,
                    minPrice,
                    maxPrice,
                    minArea,
                    maxArea,
                    city,
                    district,
                    ward,
                    types,
                    utilities,
                    sort: sortQ,
                    postType
                    // KHÔNG gửi textSearchAI ở đây
                });

                if (res && res.success) {
                    setRooms(Array.isArray(res.rooms) ? res.rooms : []);
                    setTotal(Number(res.total) || 0);
                    setPage(pageParam);

                    // Xử lý AI message nếu có (chỉ khi có lỗi từ backend)
                    if (res.aiMessage) {
                        console.log('🤖 [FRONTEND] AI Message:', res.aiMessage);
                        if (showToast) {
                            showToast(res.aiMessage, 'warning');
                        }
                    }
                    if (res.aiStats) {
                        console.log('🤖 [FRONTEND] AI Stats:', res.aiStats);
                    }
                } else {
                    setRooms([]);
                    setTotal(0);
                }
            } catch (err) {
                console.error('Error loading paged rooms', err);
                setRooms([]);
                setTotal(0);
            }
        };
        loadPage();
    }, [searchParams, sort, postType]);

    return {
        rooms,
        total,
        page,
        setPage,
        searchParams,
        setSearchParams,
        setRooms, // Export để RoomsPage có thể update trực tiếp
        setTotal  // Export để RoomsPage có thể update trực tiếp
    };
};
