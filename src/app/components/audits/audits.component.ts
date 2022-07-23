import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuditService } from 'src/app/apis/audit.service';
import { AuditEntry } from 'src/app/models/audit.model';
import { AuditSearchComponent } from './audit-search/audit-search.component';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})
export class AuditsComponent implements OnInit {

  constructor(private audit:AuditService,private fb: FormBuilder) {
    this.formInit();
  }
  
  public dataSource: AuditEntry[];
  public filterValues:any;
  public fields = [
    "clientIp",
    "clientIpDetails",
    "createdAt",
    "email",
    "hostname",
    "serverIp",
    "serverIpDetails",
    "statusCode",
    "statusMessage",
    "updatedAt",
    "uri"
  ]
  public displayedColumns: any = ["uri",'email',"clientIp",'client_org',"serverIp",'server_org',"statusMessage","createdAt","updatedAt"]
  public totalCount=0;
  public form:FormGroup;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(AuditSearchComponent, {static: false}) auditSearchComponent: AuditSearchComponent;
  public searchText;

  ngOnInit():void{
    this.getFilterValues();
    this.getAudits(0,5)
  }

  public getAudits(pageIndex,pageSize){
    const formValues = this.form.getRawValue();
    if(this.searchText){
      formValues["searchText"] = this.searchText;
    }
    this.audit.getAudits(pageIndex,pageSize,formValues).subscribe((res:any)=>{
      this.dataSource = res.audits;
      this.totalCount = res.totalCount;
    },
    error=>{
      console.error(error.message);  
    })
  }

  public getFilterValues(){
    this.audit.getAuditFilterValues().subscribe((res:any)=>{
      this.filterValues = res
    },
    error=>{
      console.error(error.message);  
    })
  }

  public pageNavigate(event:PageEvent){
    this.getAudits(event.pageIndex,event.pageSize);
  }

  private formInit(){
    this.form = this.fb.group({
      statusCode:[''],
      statusMessage:[''],
      email:[''],
    })
  }

  public applyFilter(){
    this.auditSearchComponent.form.reset();
    this.paginator.firstPage();
    this.searchText = ''
    this.getAudits(this.paginator.pageIndex,this.paginator.pageSize);
  }

  public clearFilter(){
    this.form.reset();
    this.paginator.firstPage();
    this.searchText = ''
    this.getAudits(this.paginator.pageIndex,this.paginator.pageSize);
  }

  public auditSearch(value){
    const search =value.searchText;
    this.searchText = search;
    this.paginator.firstPage();
    this.getAudits(this.paginator.pageIndex,this.paginator.pageSize);
  }
}
