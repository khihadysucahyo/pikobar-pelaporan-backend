const ObjectId = require("mongoose").Types.ObjectId
const countByRole = (user, caseAuthors=[]) => {
  let searching
  if (user.role == "dinkeskota") {
    searching = {
      author_district_code:user.code_district_city
    }
  } else if (user.role == "dinkesprov" || user.role == "superadmin") {
    searching = {}
  } else {
    if (user.unit_id && Array.isArray(caseAuthors) && caseAuthors.length) {
      searching = {
        $or: [
          { author: { $in: caseAuthors }, transfer_status: null },
          { transfer_to_unit_id: new ObjectId(user.unit_id._id), transfer_status: 'approved' }
        ]
      }
    } else {
      searching = {
        author:new ObjectId(user._id),
        author_district_code:user.code_district_city,
        transfer_status: null
      }
    }
  }
  return searching
}

const exportByRole = (params, user) => {
  if (user.role == "dinkeskota") {
    params.author_district_code = user.code_district_city;
  } else if (user.role == "dinkesprov" || user.role == "superadmin") {
    
  } else {
    params.author = new ObjectId(user._id);
    params.author_district_code = user.code_district_city;
  }
  return params
}

const userByRole = (params, user) => {
  if (user.role == "dinkeskota") {
    params.code_district_city = user.code_district_city;
  } else {
    
  }
  return params
}

const listByRole = (user, params, search_params, schema, conditions, caseAuthors=[]) => {

  let result_search
  if (search_params == null) {
    if(user.role == "dinkeskota"){
      params.author_district_code = user.code_district_city;
      result_search = schema.find(params).where(conditions).ne("deleted")
    }else if (user.role == "dinkesprov" || user.role == "superadmin") {
      result_search = schema.find(params).where(conditions).ne("deleted")
    }else {
      if (user.unit_id && Array.isArray(caseAuthors) && caseAuthors.length) {
        params.$or = [
          { author: { $in: caseAuthors }, transfer_status: null },
          { transfer_to_unit_id: new ObjectId(user.unit_id._id), transfer_status: 'approved' }
        ]
      } else {
        params.author = new ObjectId(user._id)
        params.author_district_code = user.code_district_city
        params.transfer_status= null
      }
      result_search = schema.find(params).where(conditions).ne("deleted")
    }
  } else {
    if(user.role == "dinkeskota"){
      params.author_district_code = user.code_district_city;
      result_search = schema.find(params).or(search_params).where(conditions).ne("deleted")
    }else if (user.role == "dinkesprov" || user.role == "superadmin") {
      result_search = schema.find(params).or(search_params).where(conditions).ne("deleted")
    }else {
      if (user.unit_id && Array.isArray(caseAuthors) && caseAuthors.length) {
        params.$or = [
          { author: { $in: caseAuthors }, transfer_status: null, $or: search_params },
          { transfer_to_unit_id: new ObjectId(user.unit_id._id), transfer_status: 'approved', $or: search_params  }
        ]
        return schema.find(params).where(conditions).ne("deleted")
      } else {
        params.author = new ObjectId(user._id)
        params.author_district_code = user.code_district_city
        params.transfer_status= null
      }
      result_search = schema.find(params).or(search_params).where(conditions).ne("deleted")
    }
  }
  return result_search
}

module.exports = {
  countByRole,
  exportByRole,
  listByRole,
  userByRole
}