import React, { Component } from 'react'

class SideBar extends Component {
	state = {}

	toClick = ( id, title, address ) => {
      const contentString = `<br>Name: ${title}</br><br>Location: ${address}</br>`;
		this.props.showMarker(this.props.markers[id], contentString)
	}

	render() {
		const { venues } = this.props;
		return (
			<aside className="sidebar" aria-label="sidebar">
				<input
					type="text"
					placeholder="Search"
					value={this.props.q}
					onChange={e => this.props.getQuery(e.target.value)}
				/>
		        <ul className="list" aria-labelledby="list-order">
		          {venues.filter(filtered => filtered.venue.name
		                  .toLowerCase()
		                  .indexOf(this.props.q.toLowerCase()) > -1
		            )
		            .map((item, index) => {
		              return (
		                <li tabIndex="0" className="list-item" key={index} onClick={()=> this.toClick(index,item.venue.name,item.venue.location.formattedAddress)}>
		                 {item.venue.name}
		                </li>
		              );
		            })}

		            <div className="icon" tabIndex="0" aria-label="shrine-icon">
			        	Icons made by <a href="https://www.flaticon.com/authors/monkik" 
			        	title="monkik">monkik</a> from 
			        	<a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com </a> 
			        	is licensed by 
			        	<a href="http://creativecommons.org/licenses/by/3.0/" 
			        	title="Creative Commons BY 3.0"> CC 3.0 BY</a>
		        	</div>
		        </ul>
			</aside>
		)
	}
}

export default SideBar

