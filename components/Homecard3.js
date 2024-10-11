import React from "react";
import controls from "./Imports";
const Homecard3 = () => {
    const images = [
        { id: 1, imguri: "https://ii1.pepperfry.com/assets/988dddda-9ac9-4eea-b1e4-f74455d02d0d.jpg", title: "The Horten Collection" },
        { id: 2, imguri: "https://ii1.pepperfry.com/assets/dac568df-a32c-4e07-b2fb-3adf4470e3a3.jpg", title: "Pull Out Sofa Cum Bed" },
        { id: 3, imguri: "https://ii1.pepperfry.com/assets/b9f737a3-2039-4862-8f60-bf31c820f402.jpg", title: "The Enrico Collection" },
    ]
    return (
        <controls.View style={styles.container}>
             <controls.Text style={styles.headingtext}>Check Out These Collections</controls.Text>
            {images.map((imgurl) => (
                <controls.View key={imgurl.id} style={styles.insidecontainer}>
                    <controls.View>
                        <controls.Image source={{ uri: imgurl.imguri }} style={styles.image} />
                    </controls.View>
                    <controls.View>
                        <controls.Text style={styles.text1}>{imgurl.title}</controls.Text>
                    </controls.View>
                    <controls.View>
                        <controls.Text style={styles.text2}>20+ Options,Starting at ₹6,499</controls.Text>
                    </controls.View>
                </controls.View>
            ))}
        </controls.View>
    )
}
export default Homecard3;
const styles = controls.StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 5,
        marginRight: 5
    },
    insidecontainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop:10
    },
    image: {
        width: '100%',
        height: 210,
    },
    text1: {
        color: '#5B5B5B',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 2
    },
    text2: {
        color: '#848484',
        fontSize: 13,
    },
    headingtext:{
        color:'#8b4513',
        fontWeight:'bold',
        fontSize: 18,
        marginTop:40,
        marginBottom:5
    }
})