// 判断字符串是否为空 为null 未定义
exports._isEmpty = function (obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}

/* 公用分页
 * @param currentPage  当前页
 * @param total 总记录数
 * @param offset 每页展示的记录数
 * @param url 地址
 * @private
 */
exports._getPageUI = function (currentPage, total, offset, url) {

    let html;
    let pageTotal; // 总页数
    let prevPage;  // 上一页
    let nextPage;  // 下一页
    let startPage; // 开始页
    let endPage;   // 结束页
    // 总数小于分页数
    if (total < offset) {
        pageTotal = 1;
        prevPage = 1;
        nextPage = 1;
    } else {
        pageTotal = Math.ceil(total / offset);
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > pageTotal) {
            currentPage = pageTotal;
        }
        prevPage = (currentPage - 1) > 1 ? (currentPage - 1) : 1;
        nextPage = (Number(currentPage) + 1) > pageTotal ? pageTotal : (Number(currentPage) + 1);
    }
    html = '<nav aria-label="Page navigation"><ul class="pagination"><li class="rows"><a href="#fakelink">' + currentPage + '/' + pageTotal + '页 共 ' + total + ' 条</a></li>';
    html += '<li><a href="' + url + '?page=' + prevPage + '" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';

    if (pageTotal == 1) {
        html += '<li><a href="' + url + '?page=1">1</a></li>';
    } else {
        if (pageTotal >= 5) {
            if ((currentPage - 2) >= 1) {
                startPage = currentPage - 2;
            } else {
                startPage = (currentPage - 2) < 1 ? 1 : (currentPage - 2);
            }
            if ((Number(currentPage) + 2) <= pageTotal) {
                endPage = Number(currentPage) + 2;
            } else {
                endPage = (Number(currentPage) + 2) <= pageTotal ? (Number(currentPage) + 2) : pageTotal;
            }
        } else {
            startPage = 1;
            endPage = pageTotal;
        }
        for (let i = startPage; i <= endPage; i++) {
            if (i == currentPage) {
                html += '<li class="active"><a href="' + url + '?page=' + i + '">' + i + '<span class="sr-only">(current)</span></a></li>';
            } else {
                html += '<li><a href="' + url + '?page=' + i + '">' + i + '</a></li>';
            }
        }
    }
    html += '<li><a href="' + url + '?page=' + nextPage + '" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
    html += '</ul></nav>';

    return {
        html: html,
        currentPage: currentPage,
        offset: offset,
    };
}











