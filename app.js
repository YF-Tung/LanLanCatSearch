class Sticker {
    constructor(a) {
        this.productTitle = a[0]
        this.productId = a[1]
        this.imgId = a[2]
        this.txt = a[3]
        this.isAnimated = a[4]
    }
    getStaticStickerImg() {
            return 'https://stickershop.line-scdn.net/stickershop/v1/sticker/' + this.imgId + '/iPhone/sticker.png;compress=true'
    }
    getStickerImg() {
        // Return animated if possible
        return (
            this.isAnimated ?
            'https://stickershop.line-scdn.net/stickershop/v1/sticker/' + this.imgId + '/iPhone/sticker_animation.png;compress=true?'+Date.now() :
            'https://stickershop.line-scdn.net/stickershop/v1/sticker/' + this.imgId + '/iPhone/sticker.png;compress=true'
        )
    }
    getProductImg(productId) {
        return "https://stickershop.line-scdn.net/stickershop/v1/product/" + this.productId + "/LINEStorePC/main.png;compress=true"
    }
    getTabImg(productId) {
        return "https://stickershop.line-scdn.net/stickershop/v1/product/" + this.productId + "/iPhone/tab_on.png;compress=true"
    }
}

function lcs(a, b) {
    const na = a.length
    const nb = b.length
    var mtx = Array(na + 1).fill(null).map(() => Array(nb + 1));
    for (var i = 0; i <= na; i++) mtx[i][0] = 0;
    for (var j = 0; j <= nb; j++) mtx[0][j] = 0;
    for (var i = 1; i <= na; i++) for (var j = 1; j <= nb; j++) {
        if (a[i-1] == b[j-1]) {
            mtx[i][j] = mtx[i-1][j-1] + 1;
        } else {
            mtx[i][j] = Math.max(mtx[i-1][j], mtx[i][j-1])
        }
    }
    return mtx[na][nb]
}

const stickers = []
const col_10 = {
    productTitle: "白爛貓10☆超級煩☆",
    productId: 1815191,
    isAnimated: false,
    content: [
        [16372005, '再這樣我就報警'],
        [16372008, '讓我靜靜'],
        [16372014, '你怎麼好意思說我'],
        [16372024, '對不起我只會吃'],
    ],
}
const col_mm = {
    productTitle: "白爛貓☆麥衝動☆",
    productId: 20166,
    isAnimated: true,
    content: [
        [386621566, '我錯過什麼了嗎？'],
        [386621578, '沒人教你？尊重'],
    ],
}

function parseStickerCollection(col) {
    col.content.map(([imgId, txt]) => stickers.push(new Sticker([col.productTitle, col.productId, imgId, txt, col.isAnimated])))
}
parseStickerCollection(col_10)
parseStickerCollection(col_mm)

console.log(stickers)

class SearchResult extends React.Component {
    constructor(props) { super(props) }
    getRefreshImgSrc(src) {
        return src.replace(/(\?\d+)?$/, '?'+Date.now());
    }
    onClickImage(event) {
        let elm = document.getElementById(this.getId())
        elm.src = this.props.sticker.getStickerImg()
    }
    onChange(event) {
        this.onKeyChange(event.target.value);
    }
    getId() {
        return "img" + this.props.sticker.imgId
    }
    render() {
        const isAnimated = this.props.sticker.isAnimated
        const style = {
            cursor: isAnimated ? "pointer" : "auto",
        }
                //<img className={"img-fluid mx-auto card-img-top ItemImage"}
        const overlay = isAnimated ?  <p className={"OverlayIcon"}
                    onClick={isAnimated ? this.onClickImage.bind(this) : ""}> ▶️ </p> : <p />
        return <div className={"col"}><div className={"card shadow"}>
                <img className={"ItemImage img-fluid mx-auto card-img-to"}
                    src={this.props.sticker.getStaticStickerImg()}
                    alt={""}
                    style={style}
                    id = {this.getId()}
                    onClick={isAnimated ? this.onClickImage.bind(this) : ""}></img>
                    {overlay}
                <div className={"card-body"}>
                    <p class={"card-text"}>DEBUG: Similarity = {this.props.similarity.toFixed(3)}<br/>
                        出處：
                        <img src={this.props.sticker.getTabImg()} />
                        {this.props.sticker.productTitle}
                    </p>
                </div>
        </div></div>
    }
}

class SearchResultPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {keyText: this.props.keyText}
    }
    search(keyText) {
        // Using LCS
        const flt = function(tpl) { return tpl[1] > 0 }
        const results = stickers.map(sticker =>
            [sticker, lcs(keyText, sticker.txt)/(sticker.txt.length+1)]
        ).filter(flt).sort((tplA, tplB) =>
            - (tplA[1] - tplB[1]) // Reverse
        )
        return results
    }
    render() {
        const listKeys = this.props.keyText.split(" ");
        const searchResults = this.search(this.props.keyText).map(a =>
            <SearchResult sticker={a[0]} similarity={a[1]} />
        );
        const displayText = "總共有" + searchResults.length + "筆結果。"
        return <div><p>{displayText}</p>
            <div className={"row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3"}>{searchResults}</div>
        </div>
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {txt: ""};
        this.onKeyChange = props.onKeyChange;
    }
    onChange(event) {
        this.onKeyChange(event.target.value);
    }
    render() {
        return (
                <div className="form-group">
                <label htmlFor="header-search">
                    <span className="visually-hidden">Search blog posts</span>
                </label>
                <h3>請輸入搜尋字串：</h3>
                <h5>例如：請輸入「我」、「你」</h5>
                <input
                    className="form-control"
                    type="text"
                    id="header-search"
                    placeholder="Search your LanLanCat stickers here"
                    name="s"
                    onChange={this.onChange.bind(this)}
                />
                </div>
        );
    }
}

class Root extends React.Component {
    constructor(props) {
        super(props)
        this.state = {keyText: ""}
    }
    onKeyChange(keyText) {
        this.setState({keyText: keyText})
    }
    render() {
        return <div className="container">
            <SearchBar onKeyChange={this.onKeyChange.bind(this)} />
            <SearchResultPage keyText={this.state.keyText} />
        </div>;
    }
}

ReactDOM.render(
    <Root />,
    document.getElementById("root")
);
